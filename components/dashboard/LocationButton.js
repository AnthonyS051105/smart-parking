import React from "react";
import { TouchableOpacity, Text } from "react-native";

const LocationButton = ({ onPress, className = "" }) => {
  return (
    <TouchableOpacity
      className={`absolute right-5 bottom-52 w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg z-40 ${className}`}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text className="text-xl">📍</Text>
    </TouchableOpacity>
  );
};

export default LocationButton;
