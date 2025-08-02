"use client";

import { View, Text, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import {
  GradientBackground,
  DecorativeCircles,
  Button,
  Logo,
} from "../../components";

const { width: screenWidth } = Dimensions.get("window");

export default function Identitas() {
  const router = useRouter();

  const handleUserLogin = () => {
    router.push("/auth/status");
  };

  const handleAdminLogin = () => {
    // Implementasi untuk admin login
    console.log("Admin login clicked");
  };

  return (
    <GradientBackground>
      {/* Decorative Circles - Top Left Light */}
      <DecorativeCircles variant="top-left-light" />

      {/* Decorative Circles - Bottom Right */}
      <DecorativeCircles variant="bottom-right" />

      {/* Main Content */}
      <View className="flex-1 justify-center items-center px-8">
        {/* Logo Section */}
        <Logo size="lg" showText={true} className="mb-16" />

        {/* Login Section */}
        <View className="w-full items-center">
          {/* Login Text */}
          <Text
            className="text-white mb-8 text-center font-medium"
            style={{
              fontSize: screenWidth * 0.04,
            }}
          >
            Log in as:
          </Text>

          {/* Login Buttons */}
          <View className="w-full space-y-4">
            <View className="mx-4">
              <Button
                title="User"
                onPress={handleUserLogin}
                variant="primary"
                size="lg"
              />
            </View>

            <View className="mx-4">
              <Button
                title="Administrator"
                onPress={handleAdminLogin}
                variant="primary"
                size="lg"
              />
            </View>
          </View>
        </View>
      </View>
    </GradientBackground>
  );
}
