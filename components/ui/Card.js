import React from "react";
import { View } from "react-native";
import { getResponsivePadding } from "../../utils/responsive";
import { SHADOWS, COLORS } from "../../utils/styles";

/**
 * Card component dengan manual styling untuk konsistensi dengan design awal
 *
 * Props:
 * - children: ReactNode - Konten card
 * - variant: "default" | "glass" | "elevated" - Style variant
 * - padding: "none" | "sm" | "md" | "lg" - Padding size
 * - style: object - Custom style
 */
export default function Card({
  children,
  variant = "glass",
  padding = "md",
  style = {},
}) {
  const getCardStyle = () => {
    // Base style
    const baseStyle = {
      borderRadius: 24,
    };

    // Variant styles
    const variantStyles = {
      default: {
        backgroundColor: COLORS.background.card,
        ...SHADOWS.card,
      },
      glass: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.2)",
        ...SHADOWS.cardGlass,
      },
      elevated: {
        backgroundColor: COLORS.background.card,
        ...SHADOWS.cardElevated,
      },
    };

    // Padding styles
    const paddingValues = {
      none: 0,
      sm: getResponsivePadding(16),
      md: getResponsivePadding(24),
      lg: getResponsivePadding(32),
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
      padding: paddingValues[padding],
      ...style,
    };
  };

  return <View style={getCardStyle()}>{children}</View>;
}
