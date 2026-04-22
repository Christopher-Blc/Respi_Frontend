import { router, Stack } from 'expo-router';
import { GlassTextButton } from '../../../../components/login/glassTextButton';
import { Touchable, TouchableOpacity, View, Text } from 'react-native';

export default function bookingLayout() {
  return (
    <Stack
    //   screenOptions={{
    //     animation: 'fade',
    //     headerShown: true,
    //     headerTitleAlign: 'center',
    //     headerLeft: () => (
    //       <View style={{ flex: 1, marginLeft: 20 }}>
    //         <TouchableOpacity onPress={() => router.back()}>
    //           <Text style={{ color: '#df3f3fd2' }}>Cancel</Text>
    //         </TouchableOpacity>
    //       </View>
    //     ),

    //     headerBackButtonDisplayMode: 'default',
    //   }}
    >
      {/* <Stack.Screen name="createBooking" />
      <Stack.Screen name="index" /> */}
    </Stack>
  );
}
