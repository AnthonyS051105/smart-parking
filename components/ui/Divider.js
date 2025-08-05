import React from "react";
import { View, Text } from "react-native";
import { getResponsiveFontSize } from "../../utils/responsive";
import { COLORS } from "../../utils/styles";

export default function Divider({
  text = "Or",
  color = COLORS.text.white,
  lineColor = "#FFFFFF",
  containerStyle = {},
  textStyle = {},
  lineMargin = 0,
}) {
  const fontSize = getResponsiveFontSize(12);
  const responsiveMargin = getResponsiveFontSize(8);
  const responsiveVerticalMargin = getResponsiveFontSize(12);
  const responsiveLineMargin = getResponsiveFontSize(lineMargin);

  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          marginVertical: responsiveVerticalMargin,
          marginHorizontal: responsiveLineMargin,
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
              marginHorizontal: responsiveMargin,
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
