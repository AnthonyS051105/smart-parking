import React from "react";
import { View, Dimensions } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function DecorativeCircles({ variant = "default" }) {
  // Shadow sesuai gambar: X=0, Y=4, Blur=4.8, Spread=0, #000000 25%
  const circleShadow = {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4.8,
    elevation: 8,
  };

  const renderCircles = () => {
    switch (variant) {
      case "top-left":
        return (
          <View className="absolute inset-0 opacity-40">
            <View
              className="absolute bg-primary-light rounded-full"
              style={{
                width: screenWidth * 0.5,
                height: screenWidth * 0.5,
                left: screenWidth * 0.13,
                top: -screenWidth * 0.25,
              }}
            />
            <View
              className="absolute bg-primary-light rounded-full"
              style={{
                width: screenWidth * 0.5,
                height: screenWidth * 0.5,
                left: -screenWidth * 0.2,
                top: -screenWidth * 0.15,
              }}
            />
          </View>
        );

      case "bottom-right":
        return (
          <View className="absolute inset-0 opacity-40">
            <View
              className="absolute bg-primary-dark rounded-full"
              style={{
                width: screenWidth * 0.5,
                height: screenWidth * 0.5,
                right: -screenWidth * 0.28,
                bottom: -screenWidth * 0.1,
              }}
            />
            <View
              className="absolute bg-primary-dark rounded-full"
              style={{
                width: screenWidth * 0.5,
                height: screenWidth * 0.5,
                right: -screenWidth * 0.001,
                bottom: -screenWidth * 0.3,
              }}
            />
          </View>
        );

      default:
        return null;
    }
  };

  return renderCircles();
}
