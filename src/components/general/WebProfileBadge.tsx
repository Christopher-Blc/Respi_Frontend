import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Octicons from '@expo/vector-icons/Octicons';
import { useRouter } from 'expo-router';
import api from '../../services/api';
import { useAppTheme } from '../../context/ThemeContext';
import { User } from '../../types/types';
import { webProfileBadgeStyles as styles } from '../../style/general/generalComponents.styles';

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

