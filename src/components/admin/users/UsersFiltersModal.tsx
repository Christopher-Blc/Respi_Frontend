import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import { BlurViewCompat } from '../../general/BlurViewCompat';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../../context/ThemeContext';
import { User } from '../../../types/types';
import { GlassTextButton } from '../../login/glassTextButton';
import { GlassTextInput } from '../../login/glassTextInput';

type Props = {
  visible: boolean;
  onClose: () => void;
  registrationFromFilter: string;
  setRegistrationFromFilter: (value: string) => void;
  registrationToFilter: string;
  setRegistrationToFilter: (value: string) => void;
  userFilter: string;
  setUserFilter: (value: string) => void;
  roleFilter: 'ALL' | User['role'];
  setRoleFilter: (value: 'ALL' | User['role']) => void;
  activeFilter: 'ALL' | 'ACTIVE' | 'INACTIVE';
  setActiveFilter: (value: 'ALL' | 'ACTIVE' | 'INACTIVE') => void;
  clearFilters: () => void;
};

const ROLE_OPTIONS: Array<'ALL' | User['role']> = [
  'ALL',
  'SUPER_ADMIN',
  'ADMIN',
  'USER',
  'CLIENTE',
];

const ACTIVE_OPTIONS: Array<{
  value: 'ALL' | 'ACTIVE' | 'INACTIVE';
  label: string;
}> = [
  { value: 'ALL', label: 'Todos' },
  { value: 'ACTIVE', label: 'Activos' },
  { value: 'INACTIVE', label: 'Inactivos' },
];

const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function UsersFiltersModal({
  visible,
  onClose,
  registrationFromFilter,
  setRegistrationFromFilter,
  registrationToFilter,
  setRegistrationToFilter,
  userFilter,
  setUserFilter,
  roleFilter,
  setRoleFilter,
  activeFilter,
  setActiveFilter,
  clearFilters,
}: Props) {
  const { theme, isDarkMode } = useAppTheme();

  const overlayColor = 'rgba(0,0,0,0.5)';
  const cardBackground = isDarkMode
    ? 'rgba(16,20,32,0.78)'
    : 'rgba(255,255,255,0.8)';
  const borderColor = theme.primarySoft;
  const pillInactiveBg = theme.inputBackground;
  const pillInactiveBorder = theme.borderInput;
  const pillActiveBg = theme.primaryButton;
  const pillActiveBorder = theme.primary;
  const pillInactiveText = theme.textBody;
  const pillActiveText = theme.onPrimary;
  const todayDate = getTodayDateString();
  const todaySelected =
    registrationFromFilter.trim() === todayDate &&
    registrationToFilter.trim() === todayDate;

  const toggleTodayRange = () => {
    if (todaySelected) {
      setRegistrationFromFilter('');
      setRegistrationToFilter('');
      return;
    }
    setRegistrationFromFilter(todayDate);
    setRegistrationToFilter(todayDate);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: overlayColor,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 24,
        }}
      >
        <Pressable
          onPress={onClose}
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
        />
        <View
          style={{
            width: '100%',
            maxWidth: 520,
            borderRadius: 18,
            maxHeight: '84%',
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOpacity: 0.28,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: 10 },
            elevation: 14,
          }}
        >
          <BlurViewCompat
            intensity={30}
            tint={isDarkMode ? 'dark' : 'light'}
            style={{
              backgroundColor: cardBackground,
              borderWidth: 1,
              borderColor,
              borderRadius: 18,
            }}
          >
            {/* Header */}
            <View
              style={{
                paddingHorizontal: 16,
                paddingTop: 16,
                paddingBottom: 12,
                borderBottomWidth: 1,
                borderBottomColor: theme.primarySoft,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text
                style={{
                  color: theme.textTitle,
                  fontSize: 18,
                  fontWeight: '800',
                }}
              >
                Filtros
              </Text>
              <TouchableOpacity
                onPress={onClose}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: theme.inputBackground,
                  borderWidth: 1,
                  borderColor: theme.borderInput,
                }}
              >
                <Ionicons name="close" size={22} color={theme.textBody} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingTop: 14,
                paddingBottom: 16,
              }}
            >
              {/* Registration date range */}
              <Text
                style={{
                  color: theme.textTitle,
                  fontSize: 13,
                  fontWeight: '600',
                  marginBottom: 8,
                }}
              >
                Fecha de registro
              </Text>
              <View style={{ marginBottom: 2 }}>
                <GlassTextInput
                  value={registrationFromFilter}
                  onChangeText={setRegistrationFromFilter}
                  placeholder="Desde (YYYY-MM-DD)"
                />
              </View>
              <View style={{ marginBottom: 14 }}>
                <GlassTextInput
                  value={registrationToFilter}
                  onChangeText={setRegistrationToFilter}
                  placeholder="Hasta (YYYY-MM-DD)"
                />
              </View>
              <TouchableOpacity
                onPress={toggleTodayRange}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                <Ionicons
                  name={todaySelected ? 'checkbox' : 'square-outline'}
                  size={20}
                  color={todaySelected ? theme.primary : theme.textBody}
                />
                <Text
                  style={{
                    color: theme.textTitle,
                    fontSize: 13,
                    fontWeight: '600',
                  }}
                >
                  Hoy
                </Text>
              </TouchableOpacity>

              {/* User filter */}
              <Text
                style={{
                  color: theme.textTitle,
                  fontSize: 13,
                  fontWeight: '600',
                  marginBottom: 8,
                }}
              >
                Usuario
              </Text>
              <View style={{ marginBottom: 14 }}>
                <GlassTextInput
                  value={userFilter}
                  onChangeText={setUserFilter}
                  placeholder="Username, nombre o email"
                />
              </View>

              {/* Role filter */}
              <Text
                style={{
                  color: theme.textTitle,
                  fontSize: 13,
                  fontWeight: '600',
                  marginBottom: 8,
                }}
              >
                Rol
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                {ROLE_OPTIONS.map((role) => {
                  const selected = roleFilter === role;
                  return (
                    <TouchableOpacity
                      key={role}
                      onPress={() => setRoleFilter(role)}
                      style={{
                        paddingHorizontal: 13,
                        paddingVertical: 7,
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: selected
                          ? pillActiveBorder
                          : pillInactiveBorder,
                        backgroundColor: selected
                          ? pillActiveBg
                          : pillInactiveBg,
                      }}
                    >
                      <Text
                        style={{
                          color: selected ? pillActiveText : pillInactiveText,
                          fontWeight: selected ? '700' : '500',
                          fontSize: 13,
                        }}
                      >
                        {role === 'ALL' ? 'Todos' : role}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Active status filter */}
              <Text
                style={{
                  color: theme.textTitle,
                  fontSize: 13,
                  fontWeight: '600',
                  marginBottom: 8,
                }}
              >
                Estado
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 8,
                  marginBottom: 18,
                }}
              >
                {ACTIVE_OPTIONS.map(({ value, label }) => {
                  const selected = activeFilter === value;
                  return (
                    <TouchableOpacity
                      key={value}
                      onPress={() => setActiveFilter(value)}
                      style={{
                        paddingHorizontal: 13,
                        paddingVertical: 7,
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: selected
                          ? pillActiveBorder
                          : pillInactiveBorder,
                        backgroundColor: selected
                          ? pillActiveBg
                          : pillInactiveBg,
                      }}
                    >
                      <Text
                        style={{
                          color: selected ? pillActiveText : pillInactiveText,
                          fontWeight: selected ? '700' : '500',
                          fontSize: 13,
                        }}
                      >
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  gap: 12,
                  paddingTop: 16,
                  borderTopWidth: 1,
                  borderTopColor: theme.primarySoft,
                }}
              >
                <View style={{ flex: 1 }}>
                  <GlassTextButton
                    text="Limpiar"
                    onPress={clearFilters}
                    textColor={theme.textBody}
                    color={theme.backgroundAlt}
                    borderColor={theme.borderInput}
                    borderWidth={1}
                    height={46}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <GlassTextButton
                    text="Aplicar"
                    onPress={onClose}
                    textColor={theme.onPrimary}
                    color={theme.primary}
                    borderColor={theme.primary}
                    borderWidth={1}
                    height={46}
                  />
                </View>
              </View>
            </ScrollView>
          </BlurViewCompat>
        </View>
      </View>
    </Modal>
  );
}
