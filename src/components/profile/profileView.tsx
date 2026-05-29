import React, { useState } from 'react';
import { View, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { GlassTextButton } from '../../components/login/glassTextButton';
import createProfileStyles from '../../style/profile/profile.styles';
import MenuOption from '../../components/profile/menuOptions';
import DarkModeModal from '../../components/profile/darkMode.modal';
import IdiomaModal from '../../components/profile/language.modal';
import EditUserNameModal from '../../components/profile/editUserName.modal';
import EditPasswordModal from '../../components/profile/editPassword.modal';
import { useAppTheme } from '../../context/ThemeContext';
import { useHeaderHeight } from '@react-navigation/elements';
import MembresiaModal from '../../components/profile/membership.modal';
import { SessionExpiredModal } from '../../components/general/alert.modal';
import { ThemePalette } from '../../theme';
import { useProfile } from '../../hooks/profile/useProfile';
import { useTranslation } from 'react-i18next';
import { getAppLanguage } from '../../i18n';
import api from '../../services/api';
import { ROUTES } from '../../utils/routes';

type ProfileViewProps = {
  profileState?: ReturnType<typeof useProfile>;
};

export default function ProfileView({ profileState }: ProfileViewProps) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { signOut, effectiveRole, canToggleRole, toggleRoleView } = useAuth();
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
  const profile = profileState ?? useProfile();
  const {
    user,
    totalReservas,
    loading,
    avatarInitials,
    userMembershipLabel,
    refreshProfile,
  } = profile;

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
  const [modalPrivacyVisible, setModalPrivacyVisible] = useState(false);

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
  const themePastelPinkLabel = t('profileThemePastelPink', {
    defaultValue: 'Pastel Pink',
  });
  const themeSkyBlueLabel = t('profileThemeSkyBlue', {
    defaultValue: 'Sky Blue',
  });

  const themePaletteLabel =
    themePalette === 'blue'
      ? themeBlueLabel
      : themePalette === 'green'
        ? themeGreenLabel
        : themePalette === 'red'
          ? themeRedLabel
          : themePalette === 'cyan'
            ? themeCyanLabel
            : themePalette === 'pastelPink'
              ? themePastelPinkLabel
              : themePalette === 'skyBlue'
                ? themeSkyBlueLabel
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
  const showMariaCard = Number(user?.id) === 41;
  const isReviewFeatureEnabled =
    Number(user?.id) === 41 || Number(user?.id) === 31 || Number(user?.id) === 39 || Number(user?.id) === 43;
  const showRoleOption = canToggleRole;
  const showMembershipOption = effectiveRole !== 'SUPER_ADMIN';
  const showReviewsOption = isReviewFeatureEnabled;
  const showNotificationsOption = true;

  const handleOpenNotifications = () => {
    if (effectiveRole === 'SUPER_ADMIN') {
      router.push(ROUTES.admin.notificationsHistory);
      return;
    }

    router.push(ROUTES.userTabs.notificationsHistory);
  };

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

  return (
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
        {/*Header — skeleton while loading, real content once loaded */}
        <View style={styles.header}>
          {loading ? (
            <>
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: theme.borderSoft },
                ]}
              />
              <View style={{ height: 15 }} />
              {effectiveRole !== 'SUPER_ADMIN' && (
                <View
                  style={[
                    styles.reservasCountCard,
                    { backgroundColor: theme.borderSoft, opacity: 0.5 },
                  ]}
                />
              )}
            </>
          ) : (
            <>
              <View style={styles.avatar}>
                <Text style={styles.avatarInitials}>{avatarInitials}</Text>
              </View>
              <View style={{ height: 15 }} />
              {effectiveRole !== 'SUPER_ADMIN' && (
                <View style={styles.reservasCountCard}>
                  <Text style={[styles.reservasNumber, { color: theme.textTitle }]}>
                    {totalReservas || 0}
                  </Text>
                  <Text style={[styles.reservasLabel, { color: theme.textBody }]}>
                    {t('profileReservations')}
                  </Text>
                </View>
              )}
            </>
          )}
        </View>

        {showMariaCard && (
          <View style={styles.mariaCard}>
            <View style={styles.mariaCardTextWrap}>
              <Text style={styles.mariaCardTextShadow}>María</Text>
              <Text style={styles.mariaCardText}>María</Text>
            </View>
          </View>
        )}

        {/*grupo: Mi cuenta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profileMyAccount')}</Text>
          <View
            style={[styles.card, { backgroundColor: theme.backgroundCard }]}
          >
            {loading ? (
              <>
                <View
                  style={{
                    height: 44,
                    marginHorizontal: 16,
                    marginVertical: 6,
                    borderRadius: 8,
                    backgroundColor: theme.borderSoft,
                    opacity: 0.5,
                  }}
                />
                <View
                  style={{
                    height: 44,
                    marginHorizontal: 16,
                    marginVertical: 6,
                    borderRadius: 8,
                    backgroundColor: theme.borderSoft,
                    opacity: 0.5,
                  }}
                />
              </>
            ) : (
              <>
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
              </>
            )}
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
        {/* Bloque unificado: desde Cambiar vista hasta Privacidad */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profileSettings')}</Text>
          <View
            style={[styles.card, { backgroundColor: theme.backgroundCard }]}
          >
            {showRoleOption && (
              <MenuOption
                icon="swap-horizontal-outline"
                title="Cambiar vista"
                value={effectiveRole === 'SUPER_ADMIN' ? 'Admin' : 'Cliente'}
                onPress={toggleRoleView}
              />
            )}
            {showMembershipOption && (
              <MenuOption
                icon="diamond-outline"
                title={t('profileMembership')}
                value={userMembershipLabel}
                onPress={() => setModalMembresiaVisible(true)}
              />
            )}
            {showReviewsOption && (
              <MenuOption
                icon="star-outline"
                title="Crear reseña"
                value="Abrir"
                onPress={() => router.push('/(app)/(tabs)/reviews')}
              />
            )}
            {showNotificationsOption && (
              <MenuOption
                icon="notifications-outline"
                title={t('profileNotifications')}
                value={undefined}
                onPress={handleOpenNotifications}
              />
            )}
            <MenuOption
              icon="lock-closed-outline"
              title={t('profilePrivacy')}
              isLast
              value={undefined}
              onPress={() => setModalPrivacyVisible(true)}
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

      <SessionExpiredModal
        visible={modalPrivacyVisible}
        title={t('profilePrivacy')}
        message={t('profilePrivacyPlaceholder', {
          defaultValue:
            'Politica de privacidad en construccion. Proximamente anadiremos aqui toda la informacion legal.',
        })}
        confirmText={t('commonInformation', { defaultValue: 'Informacion' })}
        onConfirm={() => setModalPrivacyVisible(false)}
      />
    </>
  );
}
