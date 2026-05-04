import React from 'react';
import { Redirect } from 'expo-router';

export default function ManagementIndexRoute() {
  return <Redirect href="/(app)/(admin)/(management)/courts" />;
}
