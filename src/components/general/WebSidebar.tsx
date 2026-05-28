import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import Octicons from '@expo/vector-icons/Octicons';
import { useAppTheme } from '../../context/ThemeContext';
import {
  getChildPathMatch,
  getItemPathMatch,
  isNavigationRouteActive,
  type NavigationChildItem,
  type NavigationItem,
  type NavigationSection,
} from '../../utils/navigation';
import { webSidebarStyles as s } from '../../style/general/generalComponents.styles';

type Props = {
  sections: NavigationSection[];
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

  const isItemActive = (item: NavigationItem): boolean =>
    isNavigationRouteActive(pathname, getItemPathMatch(item));

  const isChildActive = (child: NavigationChildItem) =>
    isNavigationRouteActive(pathname, getChildPathMatch(child));

  const toggleOpen = (key: string) =>
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));

  const navigate = (route: string) => router.push(route as any);

  const renderChild = (child: NavigationChildItem) => {
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
        <Image
          source={require('../../../assets/icon.png')}
          style={{ width: 32, height: 32 }}
          resizeMode="contain"
        />
        <View style={{ flexDirection: 'column', marginLeft: 10 }}>
          <Text style={[s.logoAppName, { color: theme.textTitle }]}>
            {appName}
          </Text>
          {/* <Text style={[s.logoSubtitle, { color: theme.textSubtitle }]}>
            {appSubtitle}
          </Text> */}
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
              const itemKey = getItemPathMatch(item);
              const hasActiveChild =
                item.children?.some((child) => isChildActive(child)) ?? false;
              const open = openItems[itemKey] ?? hasActiveChild;

              return (
                <View key={itemKey}>
                  <TouchableOpacity
                    onPress={() => {
                      if (hasChildren) {
                        toggleOpen(itemKey);
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
                        (active || hasChildren || hasActiveChild) && s.bold,
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

