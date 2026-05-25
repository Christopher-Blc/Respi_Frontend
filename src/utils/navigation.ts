import { AppRoute, ROUTES } from './routes';

type Translate = (key: string) => string;

export type NavigationChildItem = {
  label: string;
  route: AppRoute;
  pathMatch?: string;
  icon?: string;
};

export type NavigationItem = {
  label: string;
  icon: string;
  route?: AppRoute;
  pathMatch?: string;
  children?: NavigationChildItem[];
};

export type NavigationSection = {
  label: string;
  items: NavigationItem[];
};

export type BurgerNavItem = {
  label: string;
  route: AppRoute;
  icon: string;
  pathMatch?: string;
};

export function derivePathMatch(route?: AppRoute): string {
  if (!route) return '/';

  const segments = route.split('/').filter((segment) => segment && !segment.startsWith('('));
  const lastSegment = segments[segments.length - 1];

  if (!lastSegment || lastSegment === 'index') {
    return '/';
  }

  return lastSegment;
}

export function getItemPathMatch(item: Pick<NavigationItem, 'pathMatch' | 'route'>): string {
  return item.pathMatch ?? derivePathMatch(item.route);
}

export function getChildPathMatch(item: Pick<NavigationChildItem, 'pathMatch' | 'route'>): string {
  return item.pathMatch ?? derivePathMatch(item.route);
}

export function isNavigationRouteActive(pathname: string, pathMatch?: string): boolean {
  const normalizedMatch = pathMatch ?? '/';

  if (normalizedMatch === '/') {
    return (
      pathname === '/' ||
      pathname === '/index' ||
      pathname === '' ||
      /^\/\(app\)\/\(tabs|admin\)\/?$/.test(pathname) ||
      /^\/\(app\)\/\(admin\)\/index\/?$/.test(pathname)
    );
  }

  return pathname.includes(normalizedMatch);
}

export function flattenNavigationItems(sections: NavigationSection[]): BurgerNavItem[] {
  return sections.flatMap((section) =>
    section.items.flatMap((item) => {
      if (item.children?.length) {
        return item.children.map((child) => ({
          label: child.label,
          route: child.route,
          icon: child.icon ?? item.icon,
          pathMatch: getChildPathMatch(child),
        }));
      }

      if (!item.route) {
        return [];
      }

      return [
        {
          label: item.label,
          route: item.route,
          icon: item.icon,
          pathMatch: getItemPathMatch(item),
        },
      ];
    })
  );
}

export function getUserNavigation(t: Translate): NavigationSection[] {
  return [
    {
      label: t('tabsSectionApp'),
      items: [
        {
          label: t('tabsHome'),
          route: ROUTES.userTabs.root,
          icon: 'home',
        },
        {
          label: t('tabsCourts'),
          route: ROUTES.userTabs.courts,
          icon: 'location',
        },
        {
          label: t('tabsBookings'),
          route: ROUTES.userTabs.bookings.root,
          icon: 'calendar',
        },
        {
          label: t('tabsProfile'),
          route: ROUTES.userTabs.profile,
          icon: 'person',
        },
      ],
    },
  ];
}

export function getAdminNavigation(t: Translate): NavigationSection[] {
  return [
    {
      label: t('adminSectionGeneral'),
      items: [
        {
          label: 'Home',
          route: ROUTES.admin.index,
          icon: 'home',
        },
        {
          label: t('adminInfo'),
          route: ROUTES.admin.info,
          icon: 'graph',
        },
        {
          label: t('tabsProfile'),
          route: ROUTES.admin.profile,
          icon: 'person',
        },
      ],
    },
    {
      label: t('adminSectionAdministration'),
      items: [
        {
          label: t('tabsCourts'),
          route: ROUTES.admin.management.courts,
          icon: 'project',
        },
        {
          label: t('adminInstallations'),
          route: ROUTES.admin.management.installations,
          icon: 'organization',
        },
        {
          label: t('adminCourtTypes'),
          route: ROUTES.admin.management.courtTypes,
          icon: 'tag',
        },
        {
          label: t('adminUsers'),
          route: ROUTES.admin.management.users,
          icon: 'people',
        },
        {
          label: t('tabsBookings'),
          route: ROUTES.admin.management.reservations,
          icon: 'calendar',
        },
        {
          label: 'Validar reserva',
          route: ROUTES.admin.management.validarReserva,
          icon: 'verified',
        },
        {
          label: t('adminPayments'),
          route: ROUTES.admin.pagos,
          icon: 'credit-card',
        },
        {
          label: t('adminMemberships'),
          route: ROUTES.admin.management.membership,
          icon: 'gift',
        },
        {
          label: t('adminReviews'),
          route: ROUTES.admin.management.reviews,
          icon: 'star',
        },
        {
          label: 'Notificaciones',
          route: ROUTES.admin.management.notifications,
          icon: 'bell',
        },
      ],
    },
  ];
}