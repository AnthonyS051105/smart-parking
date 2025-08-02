import React from "react";
import { View, Text } from "react-native";
import { getResponsiveFontSize } from "../../utils/responsive";
import { COLORS } from "../../utils/styles";

export default function Divider({
  text = "Or",
  color = COLORS.text.secondary,
  lineColor = "#E5E7EB",
  containerStyle = {},
  textStyle = {},
}) {
  const fontSize = getResponsiveFontSize(14);

  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 24,
        },
        containerStyle,
      ]}
    >
      <View
        style={{
          flex: 1,
          height: 1,
          backgroundColor: lineColor,
        }}
      />
      {text && (
        <Text
          style={[
            {
              marginHorizontal: 16,
              color,
              fontSize,
              fontFamily: "Poppins-Regular",
            },
            textStyle,
          ]}
        >
          {text}
        </Text>
      )}
      <View
        style={{
          flex: 1,
          height: 1,
          backgroundColor: lineColor,
        }}
      />
    </View>
  );
}
