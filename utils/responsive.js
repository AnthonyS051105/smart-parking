import { Dimensions, Platform } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Breakpoints untuk responsive design
export const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  large: 1200,
};

// Helper function untuk menentukan device type
export const getDeviceType = () => {
  if (Platform.OS === "web") {
    if (screenWidth >= BREAKPOINTS.large) return "large";
    if (screenWidth >= BREAKPOINTS.desktop) return "desktop";
    if (screenWidth >= BREAKPOINTS.tablet) return "tablet";
  }
  return "mobile";
};

// Helper function untuk responsive sizing
export const getResponsiveSize = (size, deviceMultiplier = {}) => {
  const deviceType = getDeviceType();
  const multiplier = deviceMultiplier[deviceType] || 1;

  return size * multiplier;
};

// Helper function untuk responsive width
export const getResponsiveWidth = (percentage = 1) => {
  const deviceType = getDeviceType();

  switch (deviceType) {
    case "large":
      return Math.min(500, screenWidth * percentage);
    case "desktop":
      return Math.min(450, screenWidth * percentage);
    case "tablet":
      return Math.min(400, screenWidth * percentage);
    default:
      return screenWidth * percentage;
  }
};

// Helper function untuk container max width
export const getContainerMaxWidth = () => {
  const deviceType = getDeviceType();

  switch (deviceType) {
    case "large":
      return 600;
    case "desktop":
      return 500;
    case "tablet":
      return 450;
    default:
      return "100%";
  }
};

// Helper function untuk padding/margin responsive
export const getResponsivePadding = (basePadding = 20) => {
  const deviceType = getDeviceType();

  switch (deviceType) {
    case "large":
      return basePadding * 2;
    case "desktop":
      return basePadding * 1.5;
    case "tablet":
      return basePadding * 1.2;
    default:
      return basePadding;
  }
};

// Helper function untuk font size responsive
export const getResponsiveFontSize = (baseSize) => {
  const deviceType = getDeviceType();

  switch (deviceType) {
    case "large":
      return baseSize * 0.8;
    case "desktop":
      return baseSize * 0.9;
    case "tablet":
      return baseSize * 0.95;
    default:
      return baseSize;
  }
};

// Helper function untuk check if is desktop/web
export const isDesktop = () => {
  return Platform.OS === "web" && screenWidth >= BREAKPOINTS.tablet;
};

// Helper function untuk check if is mobile
export const isMobile = () => {
  return Platform.OS !== "web" || screenWidth < BREAKPOINTS.tablet;
};

// Export screen dimensions
export { screenWidth, screenHeight };
