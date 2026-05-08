import { ScrollView, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import ProfileView from '../../../components/profile/profileView';

export default function ProfileClientes() {
  const { theme } = useAppTheme();

  return (
    <LinearGradient
      colors={[
        theme.profileGradientStart,
        theme.profileGradientMiddle,
        theme.profileGradientEnd,
      ]}
      style={StyleSheet.absoluteFill}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ProfileView></ProfileView>
      </ScrollView>
    </LinearGradient>
  );
}
