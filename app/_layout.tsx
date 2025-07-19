import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar'
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { Provider as PaperProvider, DefaultTheme, DarkTheme } from 'react-native-paper';
import { useState } from 'react';
import React from 'react';

export default function RootLayout() {
  useFrameworkReady();
  const [isDark, setIsDark] = useState(false);
  
  return (
    <PaperProvider theme={isDark ? DarkTheme : DefaultTheme}>
      <>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </>
    </PaperProvider>
  );
}
