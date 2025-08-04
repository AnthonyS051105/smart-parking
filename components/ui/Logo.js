import React from "react";
import { View, Text, Image, Dimensions } from "react-native";
import { cn } from "../../utils/cn";
import { getResponsiveFontSize } from "../../utils/responsive";
import { COLORS, SHADOWS } from "../../utils/styles";

const { width: screenWidth } = Dimensions.get("window");

/**
 * Logo component dengan support untuk Apple logo dan EasyParking text
 * @param {string} size - "sm", "md", "lg"
 * @param {boolean} showText - Tampilkan text EasyParking
 * @param {string} variant - "default", "apple" untuk style yang berbeda
 * @param {string} textColor - Warna text
 * @param {object} style - Custom style
 * @param {string} className - Tailwind classes
 */
export default function Logo({
  size = "md",
  showText = true,
  variant = "default",
  textColor = "#CEF1F3",
  style = {},
  className = "",
  ...props
}) {
  const getLogoSize = () => {
    const baseSizes = {
      sm: screenWidth * 0.2,
      md: screenWidth * 0.3,
      lg: screenWidth * 0.4,
    };
    return baseSizes[size];
  };

  const getTextSize = () => {
    const baseSizes = {
      sm: screenWidth * 0.07,
      md: screenWidth * 0.09,
      lg: screenWidth * 0.11,
    };
    return baseSizes[size];
  };

  const getLogoContainerStyle = () => {
    const logoSize = getLogoSize();

    return {
      width: logoSize,
      height: logoSize,
      marginBottom: getResponsiveFontSize(10),
      justifyContent: "center",
      alignItems: "center",
    };
  };

  const getImageStyle = () => {
    const logoSize = getLogoSize();

    return {
      width: logoSize,
      height: logoSize,
      resizeMode: "contain",
    };
  };

  const getTextStyle = () => {
    const fontSize = getTextSize();

    return {
      color: textColor,
      fontSize: fontSize,
      fontFamily: "Poppins-ExtraBold",
      textAlign: "center",
      letterSpacing: 0,
      lineHeight: fontSize * 1.2, // Diperbesar dari 1.0 ke 1.2 untuk memberikan ruang lebih
      // Shadow sesuai gambar
      textShadowColor: "rgba(0, 0, 0, 0.25)",
      textShadowOffset: { width: 0, height: 4 },
      textShadowRadius: 4,
      // Tambahan padding untuk menghindari clipping
      includeFontPadding: false, // Android specific
      textAlignVertical: "center", // Android specific
    };
  };

  const getTextContainerStyle = () => {
    const fontSize = getTextSize();

    return {
      // Berikan extra ruang untuk shadow dan descender
      paddingBottom: 8, // Extra space untuk shadow
      paddingTop: 4, // Extra space untuk ascender
      minHeight: fontSize * 1.3, // Minimum height untuk mencegah clipping
    };
  };

  return (
    <View className={cn("items-center", className)} style={style} {...props}>
      {/* Logo Image */}
      <View style={getLogoContainerStyle()}>
        <Image
          source={require("../../assets/icons/465abb021f7ccecbf70e8303bed15887815b29fb.png")}
          style={getImageStyle()}
        />
      </View>

      {/* App Title dengan container yang cukup untuk shadow */}
      {showText && (
        <View style={getTextContainerStyle()}>
          <Text style={getTextStyle()}>EasyParking</Text>
        </View>
      )}
    </View>
  );
}
