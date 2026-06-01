import { Tabs } from 'expo-router';
import React from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSegments } from 'expo-router';
import Octicons from '@expo/vector-icons/Octicons';
import { BlurViewCompat } from '../../../components/general/BlurViewCompat';
import { useAppTheme } from '../../../context/ThemeContext';
import WebSidebar from '../../../components/general/WebSidebar';
import WebBurgerMenu from '../../../components/general/WebBurgerMenu';
import WebProfileBadge from '../../../components/general/WebProfileBadge';
import { useTranslation } from 'react-i18next';
import { RESPONSIVE_NAVIGATION_BREAKPOINT } from '../../../constants';
import { useAdminRoleCheck } from '../../../hooks/admin/useAdminRoleCheck';
import { SessionExpiredModal } from '../../../components/general/alert.modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  flattenNavigationItems,
  getAdminNavigation,
} from '../../../utils/navigation';
import { ROUTES } from '../../../utils/routes';
import { WEB_SIDEBAR_TOP_AREA_HEIGHT } from '../../../style/general/generalComponents.styles';

export const WEB_ADMIN_HEADER_HEIGHT = WEB_SIDEBAR_TOP_AREA_HEIGHT;

export default function AdminTabLayout() {
  const { isDarkMode, theme } = useAppTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isWideScreen = width >= RESPONSIVE_NAVIGATION_BREAKPOINT;

  // Verificar periódicamente si el usuario sigue siendo admin
  const { showExpiredModal, setShowExpiredModal } = useAdminRoleCheck();

  const TAB_BAR_BASE_HEIGHT = 56;
  const tabBarHeight = TAB_BAR_BASE_HEIGHT + insets.bottom;

  const adminSidebarSections = getAdminNavigation(t);
  const adminBurgerNavItems = flattenNavigationItems(adminSidebarSections);

  const tabs = (
    <Tabs
      screenOptions={{
        headerTitleContainerStyle: isWideScreen
          ? {
              top: 0,
              bottom: 0,
            }
          : {
              paddingBottom: 10,
            },
        headerBackgroundContainerStyle: {
          backgroundColor: theme.primaryHeader,
          borderBottomColor: theme.primarySoft,
          borderBottomWidth: 1,
        },
        headerStyle: isWeb
          ? {
              height: WEB_ADMIN_HEADER_HEIGHT,
            }
          : undefined,
        headerShown: true,
        headerTitleAlign: isWideScreen ? 'left' : 'center',
        headerTintColor: theme.headerText,
        headerLeft: !isWideScreen
          ? () => (
              <WebBurgerMenu
                navItems={adminBurgerNavItems}
                navigationMode="replace"
              />
            )
          : undefined,
        headerTransparent: true,
        headerBackground: () => (
          <BlurViewCompat
            intensity={50}
            tint={isDarkMode ? 'dark' : 'light'}
            style={StyleSheet.absoluteFill}
            experimentalBlurMethod="none"
          />
        ),
        tabBarActiveTintColor: theme.tabActive,
        tabBarInactiveTintColor: theme.tabInactive,
        tabBarLabelPosition: 'below-icon',
        tabBarStyle:
          isWeb || isWideScreen
            ? { display: 'none' }
            : {
                position: 'absolute',
                height: tabBarHeight,
                paddingTop: 6,
                paddingBottom: insets.bottom + 4,
                backgroundColor: theme.primaryHeader,
                elevation: 0,
                borderColor: theme.primarySoft,
                borderTopWidth: 1,
              },
        headerRight: isWideScreen
          ? () => <WebProfileBadge profileRoute={ROUTES.admin.profile} />
          : undefined,
        tabBarBackground: () => (
          <BlurViewCompat
            intensity={80}
            tint={isDarkMode ? 'dark' : 'light'}
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarLabelStyle: {
          marginBottom: 0,
        },
        animation: 'fade',
      }}
    >
      {/* TAB 1: GESTIÓN GENERAL */}
      <Tabs.Screen
        name="index"
        options={{
          title: t('adminManagement'),
          tabBarIcon: ({ color, size }) => (
            <Octicons name="tools" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="notifications-history"
        options={{
          headerShown: false,
          href: null,
        }}
      />

      <Tabs.Screen
        name="info"
        options={{
          title: t('adminInfo'),
          tabBarLabel: t('adminInfo'),
          tabBarIcon: ({ color, size }) => (
            <Octicons name="graph" size={size} color={color} />
          ),
        }}
      />

      {/* TAB 3: PERFIL ADMIN */}
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabsProfile'),
          tabBarIcon: ({ color, size }) => (
            <Octicons name="person" size={size} color={color} />
          ),
        }}
      />

      {/* <Tabs.Screen
        name="notificaciones"
        options={{
          title: 'Notificaciones',
          href: null,
        }}
      /> */}

      <Tabs.Screen
        name="(management)"
        options={{
          title: t('adminManagement'),
          href: null,
        }}
      />
    </Tabs>
  );

  return (
    <React.Fragment>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        animated
      />
      {isWideScreen ? (
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <WebSidebar
            sections={adminSidebarSections}
            appName="RESPI"
            appSubtitle={t('adminPanelSubtitle')}
            topAreaHeight={WEB_ADMIN_HEADER_HEIGHT}
          />
          <View style={{ flex: 1 }}>{tabs}</View>
        </View>
      ) : (
        tabs
      )}
      <SessionExpiredModal
        visible={showExpiredModal}
        title={t('adminAccessRevoked')}
        message={t('adminAccessRevokedMessage')}
        confirmText={t('commonUnderstood')}
        onConfirm={() => setShowExpiredModal(false)}
      />
    </React.Fragment>
  );
}
