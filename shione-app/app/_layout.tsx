import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import "../global.css"
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { initializeNotifications, scheduleDailyMoodReminder } from '@/services/notification.service';
import { useEffect } from 'react';
import { initializeDatabase } from '@/database/database';
import { SyncService } from '@/services/sync.service';

export default function RootLayout() {

//    useEffect(() => {

//      const setupNotifications = async () => {
//         await initializeNotifications();
//          await scheduleDailyMoodReminder();
//     };

//     setupNotifications();

//  }, []);

useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initializeApp = async () => {
        try {
            console.log("📦 Initializing database...");

            await initializeDatabase();

            console.log("✅ Database initialized");

            const syncService = new SyncService();

            console.log("🔄 Running initial sync...");

            unsubscribe = await syncService.startAutoSync();

            console.log("✅ Initial sync started");

        } catch (error) {
            console.error(
                "❌ App initialization failed:",
                error
            );
        }
    };

    void initializeApp();

    return () => {
        unsubscribe?.();
    };
}, []);


  return (
    <>
    <GestureHandlerRootView style={{ flex: 1 }}>
    <BottomSheetModalProvider>
      <Stack initialRouteName="index">
        <Stack.Screen 
          name="index" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="onboarding" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="(auth)" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="(tabs)" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="privacy-policy" 
          options={{ headerShown: false }} 
        />
      </Stack>
      
      <StatusBar style="light" />
      </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </>
  )
}