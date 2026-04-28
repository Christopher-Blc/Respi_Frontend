import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import ProfileView from '../../../components/profile/profileView';

export default function ProfileClientes() {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ProfileView></ProfileView>
    </ScrollView>
  );
}
