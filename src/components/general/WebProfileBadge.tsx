import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Octicons from '@expo/vector-icons/Octicons';
import { useRouter } from 'expo-router';
import api from '../../services/api';
import { useAppTheme } from '../../context/ThemeContext';
import { User } from '../../types/types';

export default function WebProfileBadge({
  profileRoute,
}: {
  profileRoute?: string;
}) {
  const { theme } = useAppTheme();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    api
      .get('/users/profile/me')
      .then((r) => setUser(r.data))
      .catch(() => {});
  }, []);

  const initials = user
    ? `${user.name?.charAt(0) ?? ''}${user.surname?.charAt(0) ?? ''}`.toUpperCase()
    : null;

  const handlePress = () => {
    const route = profileRoute ?? '/(app)/(tabs)/profile';
    router.push(route as any);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.container}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <View
        style={[
          styles.avatarCircle,
          {
            backgroundColor: theme.primary + '22',
            borderColor: theme.primary + '55',
          },
        ]}
      >
        {initials ? (
          <Text style={[styles.initials, { color: theme.primary }]}>
            {initials}
          </Text>
        ) : (
          <Octicons name="person" size={16} color={theme.primary} />
        )}
      </View>
      {user?.username && (
        <Text
          style={[
            styles.username,
            { color: theme.headerText ?? theme.primary },
          ]}
        >
          {user.username}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 999,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontSize: 12,
    fontWeight: '800',
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
  },
});
