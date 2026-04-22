import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Para evitar el SafeAreaView deprecated
import { useAuth } from '../../../context/AuthContext';
import { GlassTextButton } from '../../../components/login/glassTextButton';
import api from '../../../services/api';
import { User } from '../../../types/types';

export default function ProfileClientes() {
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<User>();

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

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const MenuOption = ({
    icon,
    title,
    value,
    isLast,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    value?: string;
    isLast?: boolean;
  }) => (
    <TouchableOpacity
      style={[styles.optionRow, isLast && { borderBottomWidth: 0 }]}
    >
      <View style={styles.optionLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={20} color="#B89B5E" />
        </View>
        <Text style={styles.optionTitle}>{title}</Text>
      </View>
      <View style={styles.optionRight}>
        {value && <Text style={styles.optionValue}>{value}</Text>}
        <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
      </View>
    </TouchableOpacity>
  );

  return loading ? (
    <View
      style={[
        styles.container,
        { justifyContent: 'center', alignItems: 'center' },
      ]}
    >
      <ActivityIndicator size={36} color="#CA8E0E" />
    </View>
  ) : (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 40 },
        ]}
      >
        {/* SECCIÓN AVATAR */}
        <View style={styles.header}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: 'https://avatar.iran.liara.run/public/31' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editBadge}>
              <Ionicons name="camera" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>
            {user?.username || 'Usuario Cliente'}
          </Text>
          <Text style={styles.userEmail}>
            {user?.email || 'cliente@ejemplo.com'}
          </Text>
        </View>

        {/*grupo: Mi cuenta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mi Cuenta</Text>
          <View style={styles.card}>
            <MenuOption
              icon="person-outline"
              title="Nombre de usuario"
              value={user?.username || 'JuanPerez88'}
              isLast={undefined}
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
              isLast
            />
          </View>
        </View>

        {/* GRUPO 2: APP */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuración</Text>
          <View style={styles.card}>
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
            color="rgba(191, 4, 4, 0.1)"
            borderColor="#ffb8b8"
            borderWidth={1}
            style={styles.logoutButtonCustom}
          />
        </View>

        <Text style={styles.RespiText}>ResPi®</Text>
        <Text style={styles.versionText}>Versión 1.0.2</Text>
      </ScrollView>
      {loading && (
        <View style={styles.loadingOverlayList} pointerEvents="none">
          <ActivityIndicator size={36} color="#CA8E0E" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    // El paddingBottom se maneja dinámicamente arriba
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#D4AF37',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 5,
    backgroundColor: '#B89B5E',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  section: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
    marginBottom: 10,
    marginLeft: 5,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0', // Líneas de separación restauradas
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 35,
    height: 35,
    borderRadius: 8,
    backgroundColor: '#FDF8ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionTitle: {
    fontSize: 16,
    color: '#333',
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionValue: {
    fontSize: 14,
    color: '#AAA',
    marginRight: 8,
  },
  logoutContainer: {
    marginTop: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  logoutButtonCustom: {
    width: '100%',
    height: 55,
    borderRadius: 15,
  },
  RespiText: {
    textAlign: 'center',
    color: '#CCC',
    marginTop: 20,
    fontSize: 12,
  },
  versionText: {
    textAlign: 'center',
    color: '#CCC',
    fontSize: 12,
    marginBottom: -25,
  },
  loadingOverlayList: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
});
