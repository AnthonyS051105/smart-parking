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
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: padding,
          paddingBottom: desktop ? 80 : 40,
        }}
      >
        <Logo
          size={desktop ? "md" : "lg"}
          showText={true}
          className="mb-16"
          style={{
            marginBottom: desktop ? 60 : 80,
          }}
        />
      </View>

      {/* Bottom Section */}
      <View
        style={{
          paddingHorizontal: padding,
          paddingBottom: padding,
          gap: 16,
        }}
      >
        <Button
          title="GET STARTED"
          onPress={handleGetStarted}
          variant="primary"
          size="lg"
        />

        <Button
          title="I ALREADY HAVE AN ACCOUNT"
          onPress={handleAlreadyHaveAccount}
          variant="ghost"
          size="md"
        />
      </View>
    </GradientBackground>
  );
}
