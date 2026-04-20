import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { MotiView } from 'moti';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#61DA5F',
        tabBarInactiveTintColor: '#A6A6A6',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="home" />
          ),
        }}
      />
      <Tabs.Screen
        name="reservas"
        options={{
          title: 'Mis Reservas',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="calendar" />
          ),
        }}
      />
    </Tabs>
  );
}

// Un solo componente para el icono con animación suave
function TabIcon({ focused, iconName }: { focused: boolean; iconName: string }) {
  return (
    <MotiView
      animate={{
        translateY: focused ? -10 : 0,
        scale: focused ? 1.2 : 1,
      }}
      transition={{ type: 'spring', damping: 15 }}
    >
      {/* Aquí pones tu <Image /> o Icono */}
      <View style={[styles.circle, focused && styles.activeCircle]} />
    </MotiView>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#212121',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 70,
    position: 'absolute', // Esto permite que el contenido se vea por debajo si quieres
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCircle: {
    backgroundColor: '#61DA5F',
  }
});