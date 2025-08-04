"use client";

import { View } from "react-native";
import { useRouter } from "expo-router";
import {
  GradientBackground,
  DecorativeCircles,
  HeaderNavigation,
  Logo,
  Button,
} from "../../components";
import { getResponsivePadding, isDesktop } from "../../utils/responsive";

export default function Status() {
  const router = useRouter();
  const padding = getResponsivePadding(32);
  const desktop = isDesktop();

  const handleGetStarted = () => {
    router.push("/auth/signup");
  };

  const handleAlreadyHaveAccount = () => {
    router.push("/auth/login");
  };

  return (
    <GradientBackground>
      {/* Decorative Circles */}
      <DecorativeCircles variant="bottom-right" />

      {/* Header Navigation */}
      <HeaderNavigation title="User" />

      {/* Main Content */}
      <View className="flex-1 justify-center items-center px-8">
        <Logo
          size={desktop ? "md" : "lg"}
          showText={true}
          style={{
            marginBottom: desktop ? 40 : 60, // Dikurangi
          }}
        />

        {/* Bottom Section */}
        <View
          className="w-full space-y-5 px-4 mt-24"
          style={{
            paddingHorizontal: padding,
            paddingBottom: padding,
            gap: 12, // Dikurangi dari 16
          }}
        >
          <Button
            title="GET STARTED"
            onPress={handleGetStarted}
            className="rounded-full py-4"
            variant="primary"
            size="md"
          />

          <Button
            title="I ALREADY HAVE AN ACCOUNT"
            onPress={handleAlreadyHaveAccount}
            className="rounded-full py-4"
            variant="ghost"
            size="md"
          />
        </View>
      </View>
    </GradientBackground>
  );
}
