import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import Octicons from '@expo/vector-icons/Octicons';
import { useAppTheme } from '../../context/ThemeContext';

export type SidebarChildItem = {
  label: string;
  route: string;
  pathMatch: string;
};

export type SidebarItem = {
  label: string;
  route?: string;
  icon: string;
  pathMatch: string;
  children?: SidebarChildItem[];
};

export type SidebarSection = {
  label: string;
  items: SidebarItem[];
};

type Props = {
  sections: SidebarSection[];
  appName?: string;
  appSubtitle?: string;
  topAreaHeight?: number;
};

export default function WebSidebar({
  sections,
  appName = 'RESPI',
  appSubtitle = 'Workspace',
  topAreaHeight,
}: Props): React.JSX.Element {
  const { theme } = useAppTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const isRootPath = () =>
    pathname === '/' ||
    pathname === '/index' ||
    pathname === '' ||
    /^\/(app)\/(tabs|admin)\/?$/.test(pathname);

  const isItemActive = (item: SidebarItem): boolean => {
    if (item.pathMatch === '/') return isRootPath();
    return pathname.includes(item.pathMatch);
  };

  const isChildActive = (child: SidebarChildItem) =>
    pathname.includes(child.pathMatch);

  const toggleOpen = (key: string) =>
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));

  const navigate = (route: string) => router.push(route as any);

  const renderChild = (child: SidebarChildItem) => {
    const active = isChildActive(child);
    return (
      <TouchableOpacity
        key={child.route}
        onPress={() => navigate(child.route)}
        style={[s.childItem, active && { backgroundColor: theme.primarySoft }]}
      >
        <View
          style={[
            s.childDot,
            {
              backgroundColor: active
                ? theme.primary
                : (theme.iconMuted ?? theme.textSubtitle),
            },
          ]}
        />
        <Text
          style={[
            s.childLabel,
            { color: active ? theme.primary : theme.textBody },
            active && s.bold,
          ]}
        >
          {child.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        s.sidebar,
        {
          backgroundColor: theme.cardBackground,
          borderRightColor: theme.borderSoft,
        },
      ]}
    >
      {/* Logo */}
      <View
        style={[s.logoArea, topAreaHeight ? { height: topAreaHeight } : null]}
      >
        <View
          style={[
            s.logoCircle,
            {
              backgroundColor: theme.primarySoft,
              borderColor: theme.borderAccentSoft,
            },
          ]}
        >
          <Text style={[s.logoInitial, { color: theme.primary }]}>R</Text>
        </View>
        <View>
          <Text style={[s.logoAppName, { color: theme.textTitle }]}>
            {appName}
          </Text>
          <Text style={[s.logoSubtitle, { color: theme.textSubtitle }]}>
            {appSubtitle}
          </Text>
        </View>
      </View>

      <View style={[s.divider, { backgroundColor: theme.borderSoft }]} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.navContent}
      >
        {sections.map((section, si) => (
          <View key={si} style={si > 0 ? s.sectionSpacing : undefined}>
            <Text style={[s.sectionLabel, { color: theme.textSubtitle }]}>
              {section.label.toUpperCase()}
            </Text>

            {section.items.map((item) => {
              const hasChildren = !!item.children?.length;
              const active = !hasChildren && isItemActive(item);
              const open = openItems[item.pathMatch] ?? false;

              return (
                <View key={item.pathMatch}>
                  <TouchableOpacity
                    onPress={() => {
                      if (hasChildren) {
                        toggleOpen(item.pathMatch);
                      } else if (item.route) {
                        navigate(item.route);
                      }
                    }}
                    style={[
                      s.navItem,
                      active && {
                        backgroundColor: theme.primary,
                        borderRadius: 8,
                      },
                    ]}
                  >
                    <Octicons
                      name={item.icon as any}
                      size={17}
                      color={
                        active ? (theme.onPrimary ?? '#fff') : theme.primary
                      }
                      style={s.navIcon}
                    />
                    <Text
                      style={[
                        s.navLabel,
                        {
                          color: active
                            ? (theme.onPrimary ?? '#fff')
                            : theme.textBody,
                        },
                        (active || hasChildren) && s.bold,
                      ]}
                    >
                      {item.label}
                    </Text>
                    {hasChildren && (
                      <Octicons
                        name={open ? 'chevron-down' : 'chevron-right'}
                        size={13}
                        color={theme.textSubtitle}
                      />
                    )}
                    {active && <View style={s.activeIndicator} />}
                  </TouchableOpacity>

                  {hasChildren && open && (
                    <View style={s.childrenWrap}>
                      {item.children!.map(renderChild)}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  sidebar: {
    width: 240,
    height: '100%' as any,
    borderRightWidth: 1,
    flexDirection: 'column',
  },
  logoArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 12,
  },
  logoCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoInitial: {
    fontSize: 18,
    fontWeight: '800',
  },
  logoAppName: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  logoSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  divider: {
    height: 1,
  },
  navContent: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    gap: 2,
  },
  sectionSpacing: {
    marginTop: 20,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
  },
  navIcon: {
    marginRight: 10,
    width: 20,
    textAlign: 'center',
  },
  navLabel: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  bold: {
    fontWeight: '700',
  },
  activeIndicator: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.7)',
    marginLeft: 4,
  },
  childrenWrap: {
    paddingLeft: 14,
    gap: 2,
    marginBottom: 4,
  },
  childItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: 6,
    gap: 8,
  },
  childDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
  },
  childLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
});
