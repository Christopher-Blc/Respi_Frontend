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
  }, []);

  return loading ? (
    <View
      style={[
        styles.container,
        { justifyContent: 'center', alignItems: 'center' },
      ]}
    >
      <ActivityIndicator size={36} color="#CA8E0E" />
    </View>
  ) : (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#F3D69B', '#FFFFFF']}
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
              <Ionicons name="camera" size={16} color="#FFF" />
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
            <Text style={styles.reservasNumber}>{totalReservas || 0}</Text>
            <Text style={styles.reservasLabel}>Reservas</Text>
          </View>
        </View>

        {/*grupo: Mi cuenta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mi Cuenta</Text>
          <View style={styles.card}>
            <MenuOption
              icon="person-outline"
              title="Nombre de usuario"
              value={user?.username || 'JuanPerez88'}
              isLast={undefined}
              onPress={() => {
                setModalEditUserNameVisible(true);
              }}
            />
            <MenuOption
              icon="mail-outline"
              title="Email"
              value={user?.email || 'juan@mail.com'}
              isLast={undefined}
            />
            <MenuOption
              icon="language-outline"
              title="Idioma"
              value="Español"
              isLast={undefined}
              onPress={() => setModalIdiomaVisible(true)}
            />
            <MenuOption
              icon="moon-outline"
              title="Modo Oscuro"
              value="Desactivado"
              isLast
              onPress={() => setModalDarkmodeVisible(true)}
            />
          </View>
        </View>

        <View style={styles.membresiaCard}>
          <Text style={styles.sectionTitle}>MEMBRESIA</Text>
          <View style={styles.card}>
            <MenuOption
              icon="diamond-outline"
              title="Membresía"
              value={undefined}
              isLast={undefined}
              onPress={() => setModalMembresiaVisible(true)}
            />
          </View>
        </View>

        {/* GRUPO 2: APP */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuración</Text>
          <View style={styles.card}>
            <MenuOption
              icon="notifications-outline"
              title="Notificaciones"
              value={undefined}
              isLast={undefined}
            />
            <MenuOption
              icon="lock-closed-outline"
              title="Privacidad"
              isLast
              value={undefined}
            />
          </View>
        </View>

        {/* BOTÓN LOGOUT */}
        <View style={styles.logoutContainer}>
          <GlassTextButton
            text="Cerrar Sesión"
            onPress={handleLogout}
            color="rgba(191, 4, 4, 0.4)"
            borderColor="#ffb8b8"
            borderWidth={1}
            style={styles.logoutButtonCustom}
          />
        </View>

        <Text style={styles.RespiText}>ResPi®</Text>
        <Text style={styles.versionText}>Versión 1.0.2</Text>
      </ScrollView>

      {loading && (
        <View style={styles.loadingOverlayList} pointerEvents="none">
          <ActivityIndicator size={36} color="#CA8E0E" />
        </View>
      )}
      <MembresiaModal
        visible={modalMembresiaVisible}
        onClose={() => setModalMembresiaVisible(false)}
      />

      <DarkModeModal
        visible={modalDarkmodeVisible}
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
