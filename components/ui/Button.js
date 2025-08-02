import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { cn } from "../../utils/cn";
import {
  getResponsiveFontSize,
  getResponsivePadding,
} from "../../utils/responsive";
import { SHADOWS, COLORS } from "../../utils/styles";

/**
 * Button component dengan styling yang sama seperti CustomButton
 */
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
  fontFamily = "Poppins-Bold",
  ...props
}) {
  const getFontSize = () => {
    const baseSizes = {
      sm: 14,
      md: 16,
      lg: 18,
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
      borderRadius: 25,
      alignItems: "center",
      justifyContent: "center",
      opacity: disabled ? 0.6 : 1,
    };

    // Pilih shadow berdasarkan size dan variant
    const getShadow = () => {
      if (variant === "outline" || variant === "ghost") return {};

      if (size === "lg") return SHADOWS.buttonLarge;
      if (variant === "primary") return SHADOWS.buttonElevated;
      return SHADOWS.button;
    };

    switch (variant) {
      case "primary":
        return {
          ...baseStyle,
          backgroundColor: COLORS.primary.DEFAULT,
          ...getShadow(),
        };
      case "secondary":
        return {
          ...baseStyle,
          backgroundColor: COLORS.background.card,
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
      letterSpacing: 0.5,
    };

    switch (variant) {
      case "primary":
        return {
          ...baseTextStyle,
          color: COLORS.text.primary,
          ...SHADOWS.text,
        };
      case "secondary":
        return {
          ...baseTextStyle,
          color: COLORS.text.primary,
        };
      case "outline":
      case "ghost":
        return {
          ...baseTextStyle,
          color: COLORS.text.white,
          ...SHADOWS.text,
        };
      default:
        return baseTextStyle;
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
      {icon && icon}
      <Text style={[getTextStyle(), textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}
