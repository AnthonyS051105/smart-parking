import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import {
  getResponsiveFontSize,
  getResponsivePadding,
} from "../../utils/responsive";
import { SHADOWS, COLORS } from "../../utils/styles";
import { cn } from "../../utils/cn";

export default function HeaderNavigation({
  title = "",
  showBack = true,
  onBackPress = null,
  rightComponent = null,
  containerStyle = {},
}) {
  const router = useRouter();
  const fontSize = getResponsiveFontSize(14);
  const padding = getResponsivePadding(24);

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View
      style={[
        {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: padding,
          paddingVertical: 16,
        },
        containerStyle,
      ]}
    >
      {/* Back Button */}
      {showBack ? (
        <TouchableOpacity
          onPress={handleBack}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 8,
          }}
          activeOpacity={0.7}
        >
          <Text
            style={{
              color: COLORS.text.white,
              fontSize,
              fontFamily: "Poppins-Bold",
              ...SHADOWS.text,
            }}
          >
            BACK
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={{ width: 50 }} />
      )}

      {/* Title */}
      {title ? (
        <Text
          style={{
            color: COLORS.primary.text,
            fontSize,
            fontFamily: "Poppins-SemiBold",
            ...SHADOWS.text,
          }}
        >
          {title}
        </Text>
      ) : (
        <View />
      )}

      {/* Right Component or Spacer */}
      {rightComponent || <View style={{ width: 50 }} />}
    </View>
  );
}
