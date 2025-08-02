import React from "react";
import { View, Dimensions } from "react-native";
import { cn } from "../../utils/cn";

const { width: screenWidth } = Dimensions.get("window");

/**
 * DecorativeCircles component dengan NativeWind styling
 *
 * Props:
 * - variant: "bottom-right" | "top-left" | "scattered" | "top-left-light" - Posisi circles
 * - opacity: number - Opacity circles (0-1)
 * - className: string - Custom classes
 */
export default function DecorativeCircles({
  opacity = 0.4,
  variant = "bottom-right",
  className = "",
}) {
  const baseCircleClasses = [
    "absolute",
    "rounded-full",
    "bg-blue-600/30", // semi-transparent blue
  ];

  const getCircleSize = (multiplier) => ({
    width: screenWidth * multiplier,
    height: screenWidth * multiplier,
  });

  const renderBottomRightCircles = () => (
    <>
      <View
        className={cn([...baseCircleClasses, className])}
        style={{
          ...getCircleSize(0.5),
          right: -screenWidth * 0.28,
          bottom: -screenWidth * 0.1,
          opacity,
        }}
      />
      <View
        className={cn([...baseCircleClasses, className])}
        style={{
          ...getCircleSize(0.4),
          right: -screenWidth * 0.001,
          bottom: -screenWidth * 0.3,
          opacity,
        }}
      />
    </>
  );

  const renderTopLeftCircles = () => (
    <>
      <View
        className={cn([...baseCircleClasses, className])}
        style={{
          ...getCircleSize(0.4),
          left: -screenWidth * 0.2,
          top: -screenWidth * 0.1,
          opacity,
        }}
      />
      <View
        className={cn([...baseCircleClasses, className])}
        style={{
          ...getCircleSize(0.3),
          left: -screenWidth * 0.05,
          top: -screenWidth * 0.2,
          opacity,
        }}
      />
    </>
  );

  const renderTopLeftLightCircles = () => (
    <>
      <View
        className={cn([...baseCircleClasses, "bg-white/10", className])}
        style={{
          ...getCircleSize(0.35),
          left: -screenWidth * 0.18,
          top: -screenWidth * 0.08,
          opacity,
        }}
      />
      <View
        className={cn([...baseCircleClasses, "bg-white/10", className])}
        style={{
          ...getCircleSize(0.25),
          left: -screenWidth * 0.03,
          top: -screenWidth * 0.15,
          opacity,
        }}
      />
    </>
  );

  const renderScatteredCircles = () => (
    <>
      <View
        className={cn([...baseCircleClasses, className])}
        style={{
          ...getCircleSize(0.3),
          right: -screenWidth * 0.15,
          top: screenWidth * 0.1,
          opacity,
        }}
      />
      <View
        className={cn([...baseCircleClasses, className])}
        style={{
          ...getCircleSize(0.25),
          left: -screenWidth * 0.1,
          top: screenWidth * 0.3,
          opacity,
        }}
      />
      <View
        className={cn([...baseCircleClasses, className])}
        style={{
          ...getCircleSize(0.2),
          right: -screenWidth * 0.05,
          bottom: screenWidth * 0.4,
          opacity,
        }}
      />
    </>
  );

  const renderCircles = () => {
    switch (variant) {
      case "top-left":
        return renderTopLeftCircles();
      case "top-left-light":
        return renderTopLeftLightCircles();
      case "scattered":
        return renderScatteredCircles();
      case "bottom-right":
      default:
        return renderBottomRightCircles();
    }
  };

  return <>{renderCircles()}</>;
}
