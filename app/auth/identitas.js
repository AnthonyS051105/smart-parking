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
    console.log("Admin login clicked");
  };

  return (
    <GradientBackground>
      {/* Decorative Circles - Top Left */}
      <DecorativeCircles variant="top-left" />

      {/* Decorative Circles - Bottom Right */}
      <DecorativeCircles variant="bottom-right" />

      {/* Main Content */}
      <View className="flex-1 justify-center items-center px-8">
        {/* Logo Section with Apple Style */}
        <Logo size="lg" showText={true} variant="apple" className="mb-16" />

        {/* Login Section */}
        <View className="w-full items-center">
          <Text
            className="text-white mb-5 text-center"
            style={{
              fontSize: screenWidth * 0.04,
              fontFamily: "Poppins-Medium",
            }}
          >
            Log in as:
          </Text>

          <View className="w-full space-y-5 px-4">
            <Button
              title="User"
              onPress={handleUserLogin}
              className="rounded-full py-4"
              variant="identity"
              size="md"
            />

            <Button
              title="Administrator"
              onPress={handleAdminLogin}
              className="rounded-full py-4 mt-4"
              variant="identity"
              size="md"
            />
          </View>
        </View>
      </View>
    </GradientBackground>
  );
}
