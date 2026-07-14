import React from 'react';
import { View, Text, Platform } from 'react-native';

/**
 * Página pública de chats
 * Esta ruta es accesible sin autenticación
 * URL: /public/chats.html (web) o /public/chats (app)
 */
export default function PublicChatsPage() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18 }}>Chats Públicos</Text>
      {Platform.OS === 'web' && (
        <Text style={{ fontSize: 12, color: '#666', marginTop: 10 }}>
          Esta es una página pública accesible sin autenticación
        </Text>
      )}
    </View>
  );
}
