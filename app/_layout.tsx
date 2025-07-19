import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar'
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { PaperProvider } from 'react-native-paper';
import React from 'react';

export default function RootLayout() {
  
  return (
    <PaperProvider>
      <>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </>
    </PaperProvider>
  );
}
