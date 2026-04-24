import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient'; // Único import nuevo
import { useAuth } from '../../../context/AuthContext';
import { GlassTextButton } from '../../../components/login/glassTextButton';
import api from '../../../services/api';
import { Membresia, User } from '../../../types/types';
import createProfileStyles from '../../../style/profile.styles';
import MenuOption from '../../../components/profile/menuOptions';
import MembresiaModal from '../../../components/profile/membresia.modal';
import DarkModeModal from '../../../components/profile/darkMode.modal';
import IdiomaModal from '../../../components/profile/idioma.modal';
import { reservasActivasFilter } from '../../../filtrosApi';
import EditUserNameModal from '../../../components/profile/editUserName.modal';
import { useAppTheme } from '../../../context/ThemeContext';
import { useHeaderHeight } from '@react-navigation/elements';

export default function ProfileClientes() {
  const { signOut } = useAuth();
  const {
    isDarkMode,
    isSystemTheme,
    theme,
    setDarkMode,
    setDarkModePreview,
    setSystemTheme,
    setSystemThemePreview,
  } = useAppTheme();
  const styles = React.useMemo(() => createProfileStyles(theme), [theme]);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const [user, setUser] = useState<User>();
  const [totalReservas, setTotalReservas] = useState<number>(0);
  const [modalMembresiaVisible, setModalMembresiaVisible] = useState(false);
  const [modalIdiomaVisible, setModalIdiomaVisible] = useState(false);
  const [modalDarkmodeVisible, setModalDarkmodeVisible] = useState(false);
  const [initialDarkModeValue, setInitialDarkModeValue] = useState(isDarkMode);
  const [initialSystemThemeValue, setInitialSystemThemeValue] =
    useState(isSystemTheme);
  const [modalEditUserNameVisible, setModalEditUserNameVisible] =
    useState(false);
  const [currentMembership, setCurrentMembership] = useState<Membresia | null>(
    null,
  );

  const userMembershipLabel =
    user?.membresia_id == null
      ? 'Sin membresia'
      : currentMembership
        ? `${currentMembership.tipo} · Rango ${currentMembership.rango}`
        : `ID ${user.membresia_id}`;

  const avatarInitials = React.useMemo(() => {
    const first = user?.name?.trim()?.[0] || '';
    const last = user?.surname?.trim()?.[0] || '';

    if (first || last) {
      return `${first}${last}`.toUpperCase();
    }

    const usernameParts =
      user?.username?.trim().split(/\s+/).filter(Boolean) || [];
    const usernameFirst = usernameParts[0]?.[0] || user?.username?.[0] || 'U';
    const usernameLast = usernameParts[1]?.[0] || '';

    return `${usernameFirst}${usernameLast}`.toUpperCase();
  }, [user?.name, user?.surname, user?.username]);

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

  const fetchMembershipById = async (
    membresiaId: number | null | undefined,
  ) => {
    if (membresiaId == null) {
      setCurrentMembership(null);
      return;
    }

    try {
      const response = await api.get('/membresia');
      const payload = response.data;
      const parsed: Membresia[] = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : [];

      const found = parsed.find(
        (membership) => membership.membresia_id === membresiaId,
      );

      setCurrentMembership(found || null);
    } catch (error) {
      console.error('Error cargando membresia del usuario', error);
      setCurrentMembership(null);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchTotalReservas();
  }, []);

  useEffect(() => {
    fetchMembershipById(user?.membresia_id);
  }, [user?.membresia_id]);

  const handleSaveDarkMode = async (
    nextDarkModeValue: boolean,
    nextSystemThemeValue: boolean,
  ) => {
    try {
      if (nextSystemThemeValue) {
        setSystemTheme(true);
      } else {
        setSystemTheme(false);
        setDarkMode(nextDarkModeValue);
      }
    } catch (error) {
      console.error('Error guardando preferencia de modo oscuro', error);
    } finally {
      setModalDarkmodeVisible(false);
    }
  };

  const handleOpenDarkModeModal = () => {
    setInitialDarkModeValue(isDarkMode);
    setInitialSystemThemeValue(isSystemTheme);
    setModalDarkmodeVisible(true);
  };

  const handleCloseDarkModeModal = () => {
    if (initialSystemThemeValue) {
      setSystemThemePreview(true);
    } else {
      setSystemThemePreview(false);
      setDarkModePreview(initialDarkModeValue);
    }
    setModalDarkmodeVisible(false);
  };

  return loading ? (
    <View
      style={[
        styles.container,
        { justifyContent: 'center', alignItems: 'center' },
      ]}
    >
      <ActivityIndicator size={36} color={theme.primaryButton} />
    </View>
  ) : (
    <View style={[styles.container, { backgroundColor: theme.backgroundMain }]}>
      <LinearGradient
        colors={[
          theme.profileGradientStart,
          theme.profileGradientMiddle,
          theme.profileGradientEnd,
        ]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: headerHeight + 10,
            paddingBottom: insets.bottom + (Platform.OS === 'web' ? 100 : 120),
          },
        ]}
      >
        {/* SECCIÓN AVATAR */}
        <View style={styles.header}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitials}>{avatarInitials}</Text>
            </View>
            <TouchableOpacity style={styles.editBadge}>
              <Ionicons name="camera" size={16} color={theme.onPrimary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>
            {user?.username || 'Usuario Cliente'}
          </Text>
          <Text style={styles.userEmail}>
            {user?.email || 'cliente@ejemplo.com'}
          </Text>

          <View style={styles.reservasCountCard}>
            <Text style={[styles.reservasNumber, { color: theme.textTitle }]}>
              {totalReservas || 0}
            </Text>
            <Text style={[styles.reservasLabel, { color: theme.textBody }]}>
              Reservas
            </Text>
          </View>
        </View>

        {/*grupo: Mi cuenta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mi Cuenta</Text>
          <View
            style={[styles.card, { backgroundColor: theme.backgroundCard }]}
          >
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
              value={isDarkMode ? 'Activado' : 'Desactivado'}
              isLast
              onPress={handleOpenDarkModeModal}
            />
          </View>
        </View>

        <View style={styles.membresiaCard}>
          <Text style={styles.sectionTitle}>MEMBRESIA</Text>
          <View
            style={[styles.card, { backgroundColor: theme.backgroundCard }]}
          >
            <MenuOption
              icon="diamond-outline"
              title="Membresía"
              value={userMembershipLabel}
              isLast={true}
              onPress={() => setModalMembresiaVisible(true)}
            />
          </View>
        </View>

        {/* GRUPO 2: APP */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuración</Text>
          <View
            style={[styles.card, { backgroundColor: theme.backgroundCard }]}
          >
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
            color={theme.logoutGlass}
            borderColor={theme.logoutBorder}
            borderWidth={1}
            style={styles.logoutButtonCustom}
          />
        </View>

        <Text style={styles.RespiText}>ResPi®</Text>
        <Text style={styles.versionText}>Versión 1.0.2</Text>
      </ScrollView>

      {loading && (
        <View style={styles.loadingOverlayList} pointerEvents="none">
          <ActivityIndicator size={36} color={theme.primaryButton} />
        </View>
      )}
      <MembresiaModal
        visible={modalMembresiaVisible}
        onClose={() => setModalMembresiaVisible(false)}
      />

      <DarkModeModal
        visible={modalDarkmodeVisible}
        isDarkMode={isDarkMode}
        isSystemTheme={isSystemTheme}
        onPreview={setDarkModePreview}
        onSystemPreview={setSystemThemePreview}
        onSave={handleSaveDarkMode}
        onClose={handleCloseDarkModeModal}
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
