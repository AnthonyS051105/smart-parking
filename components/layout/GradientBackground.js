import React from "react";
import { View, StatusBar, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { getContainerMaxWidth, isDesktop } from "../../utils/responsive";
import { COLORS } from "../../utils/styles";

export default function GradientBackground({
  children,
  showStatusBar = true,
  containerStyle = {},
  gradientColors = [COLORS.gradient.start, COLORS.gradient.end],
}) {
  const maxWidth = getContainerMaxWidth();
  const desktop = isDesktop();

  return (
    <View className="flex-1">
      {showStatusBar && (
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
      )}

      <LinearGradient
        className="flex-1"
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <SafeAreaView className="flex-1">
          {/* Container dengan max width untuk desktop */}
          <View
            className="flex-1 mx-auto"
            style={{
              width: "100%",
              maxWidth: desktop ? maxWidth : "100%",
              ...containerStyle,
            }}
          >
            {children}
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
