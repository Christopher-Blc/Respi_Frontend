import { StyleSheet } from 'react-native';

export const webBurgerMenuStyles = StyleSheet.create({
  burgerBtn: {
    marginLeft: 14,
    padding: 4,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'flex-start',
    paddingTop: 64,
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 8,
    minWidth: 190,
    marginLeft: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 10,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 4,
  },
  dropdownIcon: {
    marginRight: 10,
  },
  dropdownLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
});

export const webSidebarStyles = StyleSheet.create({
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

export const webProfileBadgeStyles = StyleSheet.create({
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
