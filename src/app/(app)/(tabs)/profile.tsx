import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient'; // Único import nuevo
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../../context/AuthContext';
import { GlassTextButton } from '../../../components/login/glassTextButton';
import api from '../../../services/api';
import { User } from '../../../types/types';
import styles from '../../../style/profile.styles';
import MenuOption from '../../../components/profile/menuOptions';
import MembresiaModal from '../../../components/profile/membresia.modal';
import DarkModeModal from '../../../components/profile/darkMode.modal';
import IdiomaModal from '../../../components/profile/idioma.modal';
import { reservasActivasFilter } from '../../../filtrosApi';
import EditUserNameModal from '../../../components/profile/editUserName.modal';
import {
  lightModeSemanticTokens,
  mainThemeColorsDark,
  mainThemeColors,
} from '../../../theme';

const DARK_MODE_KEY = 'respi.profile.darkMode';

export default function ProfileClientes() {
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<User>();
  const [totalReservas, setTotalReservas] = useState<number>(0);
  const [modalMembresiaVisible, setModalMembresiaVisible] = useState(false);
  const [modalIdiomaVisible, setModalIdiomaVisible] = useState(false);
  const [modalDarkmodeVisible, setModalDarkmodeVisible] = useState(false);
  const [modalEditUserNameVisible, setModalEditUserNameVisible] =
    useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const palette = isDarkMode ? mainThemeColorsDark : mainThemeColors;

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/profile/me');
      setUser(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalReservas = async () => {
    try {
      setLoading(true);
      const response = await api.get('reserva/mis-reservas');
      const responseFiltrado = reservasActivasFilter(response);
      setTotalReservas(responseFiltrado.length);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchTotalReservas();

    const loadDarkMode = async () => {
      try {
        const savedValue = await AsyncStorage.getItem(DARK_MODE_KEY);
        if (savedValue !== null) {
          setIsDarkMode(savedValue === '1');
        }
      } catch (error) {
        console.error('Error leyendo preferencia de modo oscuro', error);
      }
    };

    loadDarkMode();
  }, []);

  const handleSaveDarkMode = async (nextValue: boolean) => {
    try {
      setIsDarkMode(nextValue);
      await AsyncStorage.setItem(DARK_MODE_KEY, nextValue ? '1' : '0');
    } catch (error) {
      console.error('Error guardando preferencia de modo oscuro', error);
    } finally {
      setModalDarkmodeVisible(false);
    }
  };

  return loading ? (
    <View
      style={[
        styles.container,
        { justifyContent: 'center', alignItems: 'center' },
      ]}
    >
      <ActivityIndicator size={36} color={palette.primaryButton} />
    </View>
  ) : (
    <View
      style={[styles.container, { backgroundColor: palette.backgroundMain }]}
    >
      <LinearGradient
        colors={
          isDarkMode
            ? [
                mainThemeColorsDark.backgroundMain,
                mainThemeColorsDark.backgroundCard,
                mainThemeColorsDark.backgroundMain,
              ]
            : [
                lightModeSemanticTokens.profileGradientStart,
                lightModeSemanticTokens.profileGradientMiddle,
                lightModeSemanticTokens.profileGradientEnd,
              ]
        }
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top, paddingBottom: insets.bottom + 40 },
        ]}
      >
        {/* SECCIÓN AVATAR */}
        <View style={styles.header}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: 'https://avatar.iran.liara.run/public/31' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editBadge}>
              <Ionicons
                name="camera"
                size={16}
                color={lightModeSemanticTokens.onPrimary}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>
            {user?.username || 'Usuario Cliente'}
          </Text>
          <Text style={styles.userEmail}>
            {user?.email || 'cliente@ejemplo.com'}
          </Text>

          {/*card dnd se ve total reservas ( no se ha probado pero en teoria el dato viene del back) */}
          <View style={styles.reservasCountCard}>
            <Text style={[styles.reservasNumber, { color: palette.textTitle }]}>
              {totalReservas || 0}
            </Text>
            <Text style={[styles.reservasLabel, { color: palette.textBody }]}>
              Reservas
            </Text>
          </View>
        </View>

        {/*grupo: Mi cuenta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mi Cuenta</Text>
          <View
            style={[styles.card, { backgroundColor: palette.backgroundCard }]}
          >
            <MenuOption
              icon="person-outline"
              title="Nombre de usuario"
              value={user?.username || 'JuanPerez88'}
              isDarkMode={isDarkMode}
              isLast={undefined}
              onPress={() => {
                setModalEditUserNameVisible(true);
              }}
            />
            <MenuOption
              icon="mail-outline"
              title="Email"
              value={user?.email || 'juan@mail.com'}
              isDarkMode={isDarkMode}
              isLast={undefined}
            />
            <MenuOption
              icon="language-outline"
              title="Idioma"
              value="Español"
              isDarkMode={isDarkMode}
              isLast={undefined}
              onPress={() => setModalIdiomaVisible(true)}
            />
            <MenuOption
              icon="moon-outline"
              title="Modo Oscuro"
              value={isDarkMode ? 'Activado' : 'Desactivado'}
              isDarkMode={isDarkMode}
              isLast
              onPress={() => setModalDarkmodeVisible(true)}
            />
          </View>
        </View>

        <View style={styles.membresiaCard}>
          <Text style={styles.sectionTitle}>MEMBRESIA</Text>
          <View
            style={[styles.card, { backgroundColor: palette.backgroundCard }]}
          >
            <MenuOption
              icon="diamond-outline"
              title="Membresía"
              value={undefined}
              isDarkMode={isDarkMode}
              isLast={undefined}
              onPress={() => setModalMembresiaVisible(true)}
            />
          </View>
        </View>

        {/* GRUPO 2: APP */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuración</Text>
          <View
            style={[styles.card, { backgroundColor: palette.backgroundCard }]}
          >
            <MenuOption
              icon="notifications-outline"
              title="Notificaciones"
              value={undefined}
              isDarkMode={isDarkMode}
              isLast={undefined}
            />
            <MenuOption
              icon="lock-closed-outline"
              title="Privacidad"
              isLast
              isDarkMode={isDarkMode}
              value={undefined}
            />
          </View>
        </View>

        {/* BOTÓN LOGOUT */}
        <View style={styles.logoutContainer}>
          <GlassTextButton
            text="Cerrar Sesión"
            onPress={handleLogout}
            color={lightModeSemanticTokens.logoutGlass}
            borderColor={lightModeSemanticTokens.logoutBorder}
            borderWidth={1}
            style={styles.logoutButtonCustom}
          />
        </View>

        <Text style={styles.RespiText}>ResPi®</Text>
        <Text style={styles.versionText}>Versión 1.0.2</Text>
      </ScrollView>

      {loading && (
        <View style={styles.loadingOverlayList} pointerEvents="none">
          <ActivityIndicator size={36} color={palette.primaryButton} />
        </View>
      )}
      <MembresiaModal
        visible={modalMembresiaVisible}
        onClose={() => setModalMembresiaVisible(false)}
      />

      <DarkModeModal
        visible={modalDarkmodeVisible}
        isDarkMode={isDarkMode}
        onSave={handleSaveDarkMode}
        onClose={() => setModalDarkmodeVisible(false)}
      />

      <IdiomaModal
        visible={modalIdiomaVisible}
        onClose={() => setModalIdiomaVisible(false)}
      />

      <EditUserNameModal
        visible={modalEditUserNameVisible}
        onClose={() => setModalEditUserNameVisible(false)}
      />
    </View>
  );
}
