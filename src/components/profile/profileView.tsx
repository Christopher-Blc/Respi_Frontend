import React, { useState } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { GlassTextButton } from '../../components/login/glassTextButton';
import createProfileStyles from '../../style/profile.styles';
import MenuOption from '../../components/profile/menuOptions';
import DarkModeModal from '../../components/profile/darkMode.modal';
import IdiomaModal from '../../components/profile/language.modal';
import EditUserNameModal from '../../components/profile/editUserName.modal';
import { useAppTheme } from '../../context/ThemeContext';
import { useHeaderHeight } from '@react-navigation/elements';
import MembresiaModal from '../../components/profile/membership.modal';
import { router } from 'expo-router';
// Importamos el hook que hemos creado
import { useProfile } from '../../hooks/useProfile';
import { useTranslation } from 'react-i18next';

export default function ProfileView() {
  const { t, i18n } = useTranslation();
  const { signOut, role } = useAuth();
  const {
    isDarkMode,
    isSystemTheme,
    theme,
    setDarkMode,
    setDarkModePreview,
    setSystemTheme,
    setSystemThemePreview,
  } = useAppTheme();

  // Estados y lógica de Datos centralizados en el Hook
  const { user, totalReservas, loading, avatarInitials, userMembershipLabel } =
    useProfile();

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

  //estados para darkmode que pilla de settings del dispositivo
  const [initialDarkModeValue, setInitialDarkModeValue] = useState(isDarkMode);
  const [initialSystemThemeValue, setInitialSystemThemeValue] =
    useState(isSystemTheme);

  //handlers que se usan en los botones
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error al cerrar sesión', error);
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
            {user?.username || t('profileUserFallback')}
          </Text>
          <Text style={styles.userEmail}>
            {user?.email || t('profileEmailFallback')}
          </Text>

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
              isLast={undefined}
              onPress={() => {
                setModalEditUserNameVisible(true);
              }}
            />
            <MenuOption
              icon="mail-outline"
              title={t('authLoginEmail')}
              value={user?.email || t('profileEmailFallback')}
              isLast={undefined}
            />
            <MenuOption
              icon="language-outline"
              title={t('profileLanguage')}
              value={
                i18n.language === 'en'
                  ? t('languageEnglish')
                  : t('languageSpanish')
              }
              isLast={undefined}
              onPress={() => setModalIdiomaVisible(true)}
            />
            <MenuOption
              icon="moon-outline"
              title={t('profileDarkMode')}
              value={isDarkMode ? t('profileEnabled') : t('profileDisabled')}
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
              value={undefined}
              isLast={undefined}
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
