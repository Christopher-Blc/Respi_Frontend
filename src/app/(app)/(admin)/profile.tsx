import { View, Text, ScrollView } from 'react-native';
import ProfileView from '../../../components/profile/profileView';

export default function ProfileAdmin() {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ProfileView></ProfileView>
    </ScrollView>
  );
}
