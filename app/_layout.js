"use client";

import "./global.css";
import { Stack } from "expo-router";
import { usePoppins } from "../hooks/usePoppins";
import { AuthProvider } from "../contexts/AuthContext";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { fontsLoaded } = usePoppins();

  // Don't render anything until fonts are loaded
  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="dashboard" />
      </Stack>
    </AuthProvider>
  );
}
