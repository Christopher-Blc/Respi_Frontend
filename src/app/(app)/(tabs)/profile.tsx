import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, RefreshControl, View } from 'react-native';
import { useAppTheme } from '../../../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import ProfileView from '../../../components/profile/profileView';
import { useProfile } from '../../../hooks/useProfile';

export default function ProfileClientes() {
  const { theme } = useAppTheme();
  const { refreshProfile } = useProfile();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshProfile();
    } catch (error) {
      console.error('Error refreshing profile:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={theme.primaryButton}
          colors={[theme.primaryButton]}
          progressBackgroundColor="#fff"
        />
      }
    >
      <LinearGradient
        colors={[
          theme.profileGradientStart,
          theme.profileGradientMiddle,
          theme.profileGradientEnd,
        ]}
        style={{ flex: 1 }}
      >
        <ProfileView></ProfileView>
      </LinearGradient>
    </ScrollView>
  );
}
