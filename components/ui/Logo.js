import React from "react";
import { View, Image, Text } from "react-native";
import {
  getResponsiveSize,
  getResponsiveFontSize,
} from "../../utils/responsive";
import { SHADOWS, COLORS } from "../../utils/styles";

export default function Logo({
  size = "large", // "small", "medium", "large"
  showText = true,
  textColor = COLORS.primary.text,
  containerStyle = {},
  imageStyle = {},
  textStyle = {},
}) {
  const getLogoSize = () => {
    const baseSizes = {
      small: 80,
      medium: 120,
      large: 140,
    };
    return getResponsiveSize(baseSizes[size]);
  };

  const getTextSize = () => {
    const baseSizes = {
      small: 20,
      medium: 28,
      large: 36,
    };
    return getResponsiveFontSize(baseSizes[size]);
  };

  return (
    <View style={[{ alignItems: "center" }, containerStyle]}>
      {/* Logo Container dengan Shadow */}
      <View
        style={{
          marginBottom: showText ? 16 : 0,
          borderRadius: getLogoSize() / 2, // Membuat circular shadow
          ...SHADOWS.logo,
          backgroundColor: "transparent",
        }}
      >
        <Image
          source={require("../../assets/icons/465abb021f7ccecbf70e8303bed15887815b29fb.png")}
          style={[
            {
              width: getLogoSize(),
              height: getLogoSize(),
              borderRadius: getLogoSize() / 2, // Membuat image circular
            },
            imageStyle,
          ]}
        />
      </View>

      {showText && (
        <Text
          style={[
            {
              color: textColor,
              fontSize: getTextSize(),
              fontFamily: "Poppins-Bold",
              letterSpacing: 1,
              textAlign: "center",
              ...SHADOWS.textTitle,
            },
            textStyle,
          ]}
        >
          EasyParking
        </Text>
      )}
    </View>
  );
}
