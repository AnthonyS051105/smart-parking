import React from "react";
import { TouchableOpacity, Text, View, Dimensions } from "react-native";
import { cn } from "../../utils/cn";
import {
  getResponsiveFontSize,
  getResponsivePadding,
} from "../../utils/responsive";
import { SHADOWS, COLORS } from "../../utils/styles";

const { width: screenWidth } = Dimensions.get("window");

export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  icon = null,
  className = "",
  fullWidth = true,
  textStyle = {},
  style = {},
  fontFamily = "Poppins-SemiBold",
  borderRadius,
  ...props
}) {
  const getFontSize = () => {
    const baseSizes = {
      sm: screenWidth * 0.035,
      md: screenWidth * 0.038,
      lg: screenWidth * 0.04,
    };
    return getResponsiveFontSize(baseSizes[size]);
  };

  const getPadding = () => {
    const basePadding = {
      sm: 12,
      md: 16,
      lg: 20,
    };
    return getResponsivePadding(basePadding[size]);
  };

  const getButtonStyle = () => {
    const baseStyle = {
      paddingVertical: getPadding(),
      paddingHorizontal: getPadding() * 1.5,
      borderRadius: borderRadius !== undefined ? borderRadius : 25,
      alignItems: "center",
      justifyContent: "center",
      opacity: disabled ? 0.6 : 1,
    };

    const getShadow = () => {
      if (variant === "outline" || variant === "ghost") return {};

      // Shadow sesuai gambar: X=0, Y=4, Blur=4.8, Spread=0, #000000 25%
      return {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4.8,
        elevation: 8,
      };
    };

    switch (variant) {
      case "primary":
        return {
          ...baseStyle,
          backgroundColor: COLORS.primary.DEFAULT,
          ...getShadow(),
        };
      case "identity":
        return {
          ...baseStyle,
          backgroundColor: "#DDF8FB", // Warna button sesuai spesifikasi
          borderRadius: borderRadius !== undefined ? borderRadius : 50,
          ...getShadow(),
        };
      case "secondary":
        return {
          ...baseStyle,
          backgroundColor: COLORS.background.card,
          ...getShadow(),
        };
      case "signup":
        return {
          ...baseStyle,
          backgroundColor: COLORS.background.signupButton,
          ...getShadow(),
        };
      case "outline":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          borderWidth: 2,
          borderColor: COLORS.text.white,
        };
      case "ghost":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = () => {
    const baseTextStyle = {
      fontSize: getFontSize(),
      fontFamily,
      textAlign: "center",
      letterSpacing: 0, // 0% letter spacing
    };

    switch (variant) {
      case "primary":
        return {
          ...baseTextStyle,
          color: "#2D2B2E",
          fontFamily: fontFamily || "Poppins-ExtraBold",
        };
      case "identity":
        return {
          ...baseTextStyle,
          color: "#2D2B2E",
          fontFamily: fontFamily || "Poppins-Bold",
        };
      case "secondary":
        return {
          ...baseTextStyle,
          color: COLORS.text.signup,
          fontFamily: fontFamily || "Poppins-SemiBold",
        };
      case "signup":
        return {
          ...baseTextStyle,
          color: COLORS.text.white,
          fontFamily: fontFamily || "Poppins-ExtraBold",
        };
      case "outline":
      case "ghost":
        return {
          ...baseTextStyle,
          color: COLORS.text.white,
          fontFamily: fontFamily || "Poppins-ExtraBold",
        };
      default:
        return {
          ...baseTextStyle,
          fontFamily: fontFamily || "Poppins-Regular",
        };
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[getButtonStyle(), fullWidth && { width: "100%" }, style]}
      className={className}
      {...props}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon && icon}
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}
