import { Stack } from 'expo-router';
import { useAppTheme } from '../../../../context/ThemeContext';

export default function bookingLayout() {
  const { theme } = useAppTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.headerBackground },
        headerTintColor: theme.headerText,
      }}
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
