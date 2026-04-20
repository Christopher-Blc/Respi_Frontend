import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons'; // O tus imágenes de Images.img1

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false, // Ocultamos el texto para que sea como tu diseño
      }}
    >
      <Tabs.Screen
        name="index" // Esto apunta a (tabs)/index.tsx
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="home" />
          ),
        }}
      />
      <Tabs.Screen
        name="reservas" // Esto apunta a (tabs)/reservas.tsx
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="calendar" />
          ),
        }}
      />
    </Tabs>
  );
}

function TabIcon({ focused, iconName }: { focused: boolean; iconName: any }) {
  return (
    <View style={styles.iconContainer}>
      <MotiView
        animate={{
          translateY: focused ? -15 : 0,
          scale: focused ? 1.2 : 1,
        }}
        transition={{ type: 'spring', damping: 15 }}
        style={[styles.circle, focused && styles.activeCircle]}
      >
        <Ionicons 
          name={iconName} 
          size={24} 
          color={focused ? 'black' : '#A6A6A6'} 
        />
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#212121',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: Platform.OS === 'android' ? 70 : 85,
    position: 'absolute',
    borderTopWidth: 0,
    elevation: 10,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    top: Platform.OS === 'ios' ? 15 : 0,
  },
  circle: {
    width: 45,
    height: 45,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCircle: {
    backgroundColor: '#61DA5F', // El verde de tu diseño
  },
});