import React from 'react';
import { ScrollView, StyleSheet, RefreshControl, View } from 'react-native';
import { useAppTheme } from '../../../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import ProfileView from '../../../components/profile/profileView';
import { useProfile } from '../../../hooks/profile/useProfile';
import { usePullToRefresh } from '../../../hooks/usePullToRefresh';

export default function ProfileClientes() {
  const { theme } = useAppTheme();
  const profileState = useProfile();
  const { refreshing, onRefresh } = usePullToRefresh(
    profileState.refreshProfile,
  );

  return (
    <LinearGradient
      colors={[
        theme.profileGradientStart,
        theme.profileGradientMiddle,
        theme.profileGradientEnd,
      ]}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primaryButton}
            colors={[theme.primaryButton]}
            progressBackgroundColor="#fff"
          />
        }
      >
        <ProfileView profileState={profileState}></ProfileView>
      </ScrollView>
    </LinearGradient>
  );
}
