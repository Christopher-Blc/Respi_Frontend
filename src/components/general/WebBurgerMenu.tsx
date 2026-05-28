import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import Octicons from '@expo/vector-icons/Octicons';
import { useAppTheme } from '../../context/ThemeContext';
import {
  isNavigationRouteActive,
  type BurgerNavItem,
} from '../../utils/navigation';
import { webBurgerMenuStyles as styles } from '../../style/general/generalComponents.styles';

type Props = {
  navItems: BurgerNavItem[];
  navigationMode?: 'push' | 'replace';
};

export default function WebBurgerMenu({
  navItems,
  navigationMode = 'push',
}: Props) {
  const [open, setOpen] = useState(false);
  const { theme } = useAppTheme();
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (item: BurgerNavItem) =>
    isNavigationRouteActive(pathname, item.pathMatch);

  const navigate = (route: string) => {
    setOpen(false);
    if (navigationMode === 'replace') {
      router.replace(route as any);
      return;
    }
    router.push(route as any);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen((v) => !v)}
        style={styles.burgerBtn}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Octicons
          name={open ? 'x' : 'three-bars'}
          size={22}
          color={theme.primary}
        />
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View
            style={[
              styles.dropdown,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.borderAccentSoft,
              },
            ]}
          >
            {navItems.map((item) => {
              const active = isActive(item);
              return (
                <TouchableOpacity
                  key={item.route}
                  onPress={() => navigate(item.route)}
                  style={[
                    styles.dropdownItem,
                    active && { backgroundColor: theme.primarySoft },
                  ]}
                >
                  <Octicons
                    name={item.icon as any}
                    size={18}
                    color={active ? theme.primary : theme.textBody}
                    style={styles.dropdownIcon}
                  />
                  <Text
                    style={[
                      styles.dropdownLabel,
                      { color: active ? theme.primary : theme.textBody },
                      active && { fontWeight: '700' },
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

