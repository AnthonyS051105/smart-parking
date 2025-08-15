import React from "react";
import { TouchableOpacity, Image } from "react-native";

const LocationButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="absolute bottom-32 right-4 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 items-center justify-center z-20"
      activeOpacity={0.8}
    >
      <Image
        source={require("../../assets/icons/search-location.png")}
        className="w-6 h-6"
        style={{ tintColor: "#3B82F6" }}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

export default LocationButton;
