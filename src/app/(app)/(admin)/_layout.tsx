import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import Octicons from '@expo/vector-icons/Octicons';
import { BlurView } from 'expo-blur';
import { useAppTheme } from '../../../context/ThemeContext';
import WebSidebar, {
  SidebarSection,
} from '../../../components/general/WebSidebar';
import WebProfileBadge from '../../../components/general/WebProfileBadge';
import { useTranslation } from 'react-i18next';

export default function AdminTabLayout() {
  const { isDarkMode, theme } = useAppTheme();
  const { t } = useTranslation();

  const adminSidebarSections: SidebarSection[] = [
    {
      label: t('adminSectionGeneral'),
      items: [
        {
          label: t('adminInfo'),
          route: '/(app)/(admin)/info',
          icon: 'graph',
          pathMatch: 'info',
        },
        {
          label: t('tabsProfile'),
          route: '/(app)/(admin)/profile',
          icon: 'person',
          pathMatch: 'profile',
        },
      ],
    },
    {
      label: t('adminSectionAdministration'),
      items: [
        {
          label: t('adminManagement'),
          icon: 'tools',
          pathMatch: 'gestion-parent',
          children: [
            {
              label: t('tabsCourts'),
              route: '/(app)/(admin)/(management)/courts',
              pathMatch: '/courts',
            },
            {
              label: t('adminCourtTypes'),
              route: '/(app)/(admin)/(management)/court-types',
              pathMatch: 'court-types',
            },
            {
              label: t('adminUsers'),
              route: '/(app)/(admin)/usuarios',
              pathMatch: 'usuarios',
            },
            {
              label: t('tabsBookings'),
              route: '/(app)/(admin)/reservas-global',
              pathMatch: 'reservas-global',
            },
            {
              label: t('adminPayments'),
              route: '/(app)/(admin)/pagos',
              pathMatch: 'pagos',
            },
            {
              label: t('adminMemberships'),
              route: '/(app)/(admin)/membresias',
              pathMatch: 'membresias',
            },
            {
              label: t('adminReviews'),
              route: '/(app)/(admin)/resenyas',
              pathMatch: 'resenyas',
            },
          ],
        },
      ],
    },
  ];

  const isWeb = Platform.OS === 'web';

  const tabs = (
    <Tabs
      screenOptions={{
        headerTitleContainerStyle: {
          paddingBottom: 10,
        },
        headerBackgroundContainerStyle: {
          backgroundColor: theme.primaryHeader,
          borderBottomColor: theme.primarySoft,
          borderBottomWidth: 1,
        },
        headerShown: true,
        headerTitleAlign: isWeb ? 'left' : 'center',
        headerTintColor: theme.headerText,
        headerTransparent: true,
        headerBackground: () => (
          <BlurView
            intensity={50}
            tint={isDarkMode ? 'dark' : 'light'}
            style={StyleSheet.absoluteFill}
            experimentalBlurMethod="none"
          />
        ),
        tabBarActiveTintColor: theme.tabActive,
        tabBarInactiveTintColor: theme.tabInactive,
        tabBarLabelPosition: 'below-icon',
        tabBarStyle: isWeb
          ? { display: 'none' }
          : {
              position: 'absolute',
              height: 90,
              paddingTop: 6,
              paddingBottom: 6,
              backgroundColor: theme.primaryHeader,
              elevation: 0,
              borderColor: theme.primarySoft,
              borderTopWidth: 1,
            },
        headerRight: isWeb
          ? () => <WebProfileBadge profileRoute="/(app)/(admin)/profile" />
          : undefined,
        tabBarBackground: () => (
          <BlurView
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

      <Tabs.Screen
        name="(management)"
        options={{
          title: t('adminManagement'),
          headerShown: false,
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
      {isWeb ? (
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <WebSidebar
            sections={adminSidebarSections}
            appName="RESPI"
            appSubtitle={t('adminPanelSubtitle')}
          />
          <View style={{ flex: 1 }}>{tabs}</View>
        </View>
      ) : (
        tabs
      )}
    </React.Fragment>
  );
}
