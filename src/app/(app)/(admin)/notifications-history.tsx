import React from 'react';
import { ROUTES } from '../../../utils/routes';
import NotificationsHistoryView from '../../../components/notifications/NotificationsHistoryView';

export default function AdminNotificationsHistory() {
  return (
    <NotificationsHistoryView
      backRoute={ROUTES.admin.profile}
      showTypeFilter={true}
    />
  );
}
