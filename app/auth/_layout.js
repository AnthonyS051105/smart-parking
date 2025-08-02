import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="identitas" />
      <Stack.Screen name="status" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="login" />
    </Stack>
  );
}
