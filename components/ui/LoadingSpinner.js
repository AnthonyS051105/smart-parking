import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { getResponsiveFontSize } from "../../utils/responsive";
import { COLORS } from "../../utils/styles";

export default function LoadingSpinner({
  size = "small", // "small", "large"
  color = COLORS.primary.DEFAULT,
  text = "",
  containerStyle = {},
  textStyle = {},
}) {
  const fontSize = getResponsiveFontSize(14);

  return (
    <View
      style={[
        {
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        },
        containerStyle,
      ]}
    >
      <ActivityIndicator size={size} color={color} />
      {text && (
        <Text
          style={[
            {
              marginTop: 8,
              fontSize,
              color: COLORS.text.secondary,
              fontFamily: "Poppins-Regular",
              textAlign: "center",
            },
            textStyle,
          ]}
        >
          {text}
        </Text>
      )}
    </View>
  );
}
