import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { GlassTextButton } from '../../components/login/glassTextButton';
import createProfileStyles from '../../style/profile.styles';
import MenuOption from '../../components/profile/menuOptions';
import DarkModeModal from '../../components/profile/darkMode.modal';
import IdiomaModal from '../../components/profile/language.modal';
import EditUserNameModal from '../../components/profile/editUserName.modal';
import EditPasswordModal from '../../components/profile/editPassword.modal';
import { useAppTheme } from '../../context/ThemeContext';
import { useHeaderHeight } from '@react-navigation/elements';
import MembresiaModal from '../../components/profile/membership.modal';
import { ThemePalette } from '../../theme';
import { useProfile } from '../../hooks/useProfile';
import { useTranslation } from 'react-i18next';
import { getAppLanguage } from '../../i18n';
import {
  requestPushPermissionsAndToken,
  scheduleLocalNotification,
} from '../../services/notificationsService';
import { transparent } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import api from '../../services/api';

export default function ProfileView() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { signOut, role } = useAuth();
  const {
    isDarkMode,
    isSystemTheme,
    themePalette,
    theme,
    setDarkModePreview,
    setThemePalettePreview,
    setThemePreferences,
    setThemePreferencesPreview,
    setSystemThemePreview,
  } = useAppTheme();

  // Estados y lógica de Datos centralizados en el Hook
  const {
    user,
    totalReservas,
    loading,
    avatarInitials,
    userMembershipLabel,
    refreshProfile,
  } = useProfile();

  //styles
  const styles = React.useMemo(() => createProfileStyles(theme), [theme]);
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  // estado de modales para cambiar nombre o darkmode etc
  const [modalMembresiaVisible, setModalMembresiaVisible] = useState(false);
  const [modalIdiomaVisible, setModalIdiomaVisible] = useState(false);
  const [modalDarkmodeVisible, setModalDarkmodeVisible] = useState(false);
  const [modalEditUserNameVisible, setModalEditUserNameVisible] =
    useState(false);
  const [modalEditPasswordVisible, setModalEditPasswordVisible] =
    useState(false);
  const [notificationStatus, setNotificationStatus] = useState(
    t('profileDisabled', { defaultValue: 'Desactivado' }),
  );

  //estados para darkmode que pilla de settings del dispositivo
  const [initialDarkModeValue, setInitialDarkModeValue] = useState(isDarkMode);
  const [initialSystemThemeValue, setInitialSystemThemeValue] =
    useState(isSystemTheme);
  const [initialThemePaletteValue, setInitialThemePaletteValue] =
    useState(themePalette);

  const themeBlueLabel = t('profileThemeBlue', { defaultValue: 'Blue' });
  const themeGreenLabel = t('profileThemeGreen', { defaultValue: 'Green' });
  const themeOrangeLabel = t('profileThemeOrange', { defaultValue: 'Orange' });
  const themeRedLabel = t('profileThemeRed', { defaultValue: 'Red' });
  const themeCyanLabel = t('profileThemeCyan', { defaultValue: 'Cyan' });

  const themePaletteLabel =
    themePalette === 'blue'
      ? themeBlueLabel
      : themePalette === 'green'
        ? themeGreenLabel
        : themePalette === 'red'
          ? themeRedLabel
          : themePalette === 'cyan'
            ? themeCyanLabel
            : themeOrangeLabel;

  const themeModeLabel = isSystemTheme
    ? t('profileSystem')
    : isDarkMode
      ? t('profileThemeDark')
      : t('profileThemeLight');

  const currentLanguageLabelByCode = {
    es: t('languageSpanish'),
    en: t('languageEnglish'),
    de: t('languageGerman'),
    fr: t('languageFrench'),
    ro: t('languageRomanian'),
    ca: t('languageCatalan'),
  };

  const currentLanguage = getAppLanguage(
    i18n.resolvedLanguage || i18n.language,
  );

  //handlers que se usan en los botones
  const handleLogout = async () => {
    try {
      await signOut();
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    }
  };

  const handleOpenDarkModeModal = () => {
    setInitialDarkModeValue(isDarkMode);
    setInitialSystemThemeValue(isSystemTheme);
    setInitialThemePaletteValue(themePalette);
    setModalDarkmodeVisible(true);
  };

  const handleCloseDarkModeModal = () => {
    if (initialSystemThemeValue) {
      setSystemThemePreview(true);
    } else {
      setSystemThemePreview(false);
      setDarkModePreview(initialDarkModeValue);
    }

    const restoredMode = initialSystemThemeValue
      ? 'system'
      : initialDarkModeValue
        ? 'dark'
        : 'light';
    setThemePreferencesPreview(restoredMode, initialThemePaletteValue);
    setModalDarkmodeVisible(false);
  };

  const handleSaveDarkMode = async (
    nextDarkModeValue: boolean,
    nextSystemThemeValue: boolean,
    nextThemePalette: ThemePalette,
  ) => {
    try {
      const nextMode = nextSystemThemeValue
        ? 'system'
        : nextDarkModeValue
          ? 'dark'
          : 'light';
      setThemePreferences(nextMode, nextThemePalette);
    } catch (error) {
      console.error('Error guardando preferencia de modo oscuro', error);
    } finally {
      setModalDarkmodeVisible(false);
    }
  };

  const handleEnableNotifications = async () => {
    const result = await requestPushPermissionsAndToken();

    if (!result.granted) {
      setNotificationStatus(
        t('profileDisabled', { defaultValue: 'Desactivado' }),
      );
      Alert.alert(
        t('profileNotifications', { defaultValue: 'Notificaciones' }),
        result.error || t('authConnectionError', { defaultValue: 'Error' }),
      );
      return;
    }

    setNotificationStatus(t('profileEnabled', { defaultValue: 'Activado' }));

    if (result.token) {
      console.log('Expo push token:', result.token);
    }

    Alert.alert(
      t('profileNotifications', { defaultValue: 'Notificaciones' }),
      t('notificationsEnabledMessage', {
        defaultValue: 'Notificaciones activadas correctamente.',
      }),
    );
  };

  const handleSendTestNotification = async () => {
    try {
      await scheduleLocalNotification(
        t('notificationsTestTitle', { defaultValue: 'Recordatorio ResPi' }),
        t('notificationsTestBody', {
          defaultValue: 'Esta es una notificacion local de prueba.',
        }),
      );

      Alert.alert(
        t('profileNotifications', { defaultValue: 'Notificaciones' }),
        t('notificationsScheduledMessage', {
          defaultValue: 'Notificacion de prueba programada en 2 segundos.',
        }),
      );
    } catch (error) {
      console.error('Error scheduling test notification', error);
      Alert.alert(
        t('profileNotifications', { defaultValue: 'Notificaciones' }),
        t('bookingCreateError', {
          defaultValue: 'No se pudo crear la reserva',
        }),
      );
    }
  };

  return loading ? (
    <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
      <Image
        source={require('../../../assets/animacionCarga.gif')}
        style={{ width: 80, height: 80 }}
      />
    </View>
  ) : (
    <>
      <View
        style={[
          { flex: 1 },
          {
            paddingTop: headerHeight + 10,
            paddingBottom: insets.bottom + (Platform.OS === 'web' ? 100 : 120),
          },
        ]}
      >
        {/*Header*/}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitials}>{avatarInitials}</Text>
          </View>

          {/* <Text style={styles.userName}>
            {user?.username || t('profileUserFallback')}
          </Text>
          <Text style={styles.userEmail}>
            {user?.email || t('profileEmailFallback')}
          </Text> */}
          <View style={{ height: 15 }} />

          {role !== 'SUPER_ADMIN' && (
            <View style={styles.reservasCountCard}>
              <Text style={[styles.reservasNumber, { color: theme.textTitle }]}>
                {totalReservas || 0}
              </Text>
              <Text style={[styles.reservasLabel, { color: theme.textBody }]}>
                {t('profileReservations')}
              </Text>
            </View>
          )}
        </View>

        {/*grupo: Mi cuenta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profileMyAccount')}</Text>
          <View
            style={[styles.card, { backgroundColor: theme.backgroundCard }]}
          >
            <MenuOption
              icon="person-outline"
              title={t('profileUsername')}
              value={user?.username || t('profileUserFallback')}
              onPress={() => {
                setModalEditUserNameVisible(true);
              }}
            />
            <MenuOption
              icon="mail-outline"
              title={t('authLoginEmail')}
              value={user?.email || t('profileEmailFallback')}
            />
            <MenuOption
              icon="key-outline"
              title={t('authLoginPassword', { defaultValue: 'Contraseña' })}
              onPress={() => setModalEditPasswordVisible(true)}
            />
            <MenuOption
              icon="language-outline"
              title={t('profileLanguage')}
              value={currentLanguageLabelByCode[currentLanguage]}
              onPress={() => setModalIdiomaVisible(true)}
            />
            <MenuOption
              icon="moon-outline"
              title={t('profileDarkMode')}
              value={`${themeModeLabel} / ${themePaletteLabel}`}
              isLast
              onPress={handleOpenDarkModeModal}
            />
          </View>
        </View>
        {role !== 'SUPER_ADMIN' && (
          <View style={styles.membresiaCard}>
            <Text style={styles.sectionTitle}>{t('profileMembership')}</Text>
            <View
              style={[styles.card, { backgroundColor: theme.backgroundCard }]}
            >
              <MenuOption
                icon="diamond-outline"
                title={t('profileMembership')}
                value={userMembershipLabel}
                isLast={true}
                onPress={() => setModalMembresiaVisible(true)}
              />
            </View>
          </View>
        )}

        {/* GRUPO 2: APP */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profileSettings')}</Text>
          <View
            style={[styles.card, { backgroundColor: theme.backgroundCard }]}
          >
            <MenuOption
              icon="notifications-outline"
              title={t('profileNotifications')}
              value={notificationStatus}
              isLast={undefined}
              onPress={() => router.push('/(app)/(tabs)/notifications-history')}
            />
            <MenuOption
              icon="paper-plane-outline"
              title={t('notificationsTestButton', {
                defaultValue: 'Notificacion de prueba',
              })}
              value={undefined}
              isLast={undefined}
              onPress={handleSendTestNotification}
            />
            <MenuOption
              icon="lock-closed-outline"
              title={t('profilePrivacy')}
              isLast
              value={undefined}
            />
          </View>
        </View>

        {/* BOTÓN LOGOUT */}
        <View style={styles.logoutContainer}>
          <GlassTextButton
            text={t('profileLogout')}
            onPress={handleLogout}
            color={theme.logoutGlass}
            borderColor={theme.logoutBorder}
            borderWidth={1}
            style={styles.logoutButtonCustom}
          />
        </View>

        <Text style={styles.RespiText}>ResPi®</Text>
        <Text style={styles.versionText}>{t('profileVersion')} 1.0.0</Text>

        {loading && (
          <View style={styles.loadingOverlayList} pointerEvents="none">
            <Image
              source={require('../../../assets/animacionCarga.gif')}
              style={{ width: 80, height: 80 }}
            />
          </View>
        )}
      </View>

      <MembresiaModal
        visible={modalMembresiaVisible}
        onClose={() => setModalMembresiaVisible(false)}
      />

      <DarkModeModal
        visible={modalDarkmodeVisible}
        isDarkMode={isDarkMode}
        isSystemTheme={isSystemTheme}
        themePalette={themePalette}
        onPreview={setDarkModePreview}
        onSystemPreview={setSystemThemePreview}
        onThemePalettePreview={setThemePalettePreview}
        onSave={handleSaveDarkMode}
        onClose={handleCloseDarkModeModal}
      />

      <IdiomaModal
        visible={modalIdiomaVisible}
        onClose={() => setModalIdiomaVisible(false)}
      />

      <EditUserNameModal
        visible={modalEditUserNameVisible}
        currentUsername={user?.username || ''}
        onUpdated={refreshProfile}
        onClose={() => setModalEditUserNameVisible(false)}
      />

      <EditPasswordModal
        visible={modalEditPasswordVisible}
        onClose={() => setModalEditPasswordVisible(false)}
      />
    </>
  );
}
