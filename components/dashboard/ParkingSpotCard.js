import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

const ParkingSpotCard = ({
  spot,
  isSelected = false,
  onPress,
  className = "",
}) => {
  const getAvailabilityStatus = () => {
    const percentage = (spot.available / spot.total) * 100;
    if (percentage > 60)
      return { color: "text-green-600", status: "Available" };
    if (percentage > 30) return { color: "text-orange-500", status: "Limited" };
    return { color: "text-red-500", status: "Almost Full" };
  };

  const availability = getAvailabilityStatus();

  return (
    <TouchableOpacity
      className={`bg-white rounded-2xl p-4 mb-3 shadow-sm ${
        isSelected ? "border-2 border-blue-500" : "border border-gray-100"
      } ${className}`}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="flex-row">
        {/* Image */}
        <View className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 mr-4">
          <Image
            source={spot.image}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        {/* Info */}
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-lg font-bold text-gray-800 flex-1">
              {spot.name}
            </Text>
            <Image
              source={require("../../assets/icons/arrow.png")}
              className="w-4 h-4 ml-2"
              style={{ tintColor: "#666" }}
            />
          </View>

          <Text className="text-sm text-gray-500 mb-2">{spot.address}</Text>

          <View className="flex-row items-center justify-between">
            <Text className="text-base font-bold text-teal-700">
              {spot.price}
            </Text>
            <View className="flex-row items-center">
              <View
                className={`w-2 h-2 rounded-full mr-2 ${
                  spot.available > spot.total * 0.6
                    ? "bg-green-500"
                    : spot.available > spot.total * 0.3
                      ? "bg-orange-500"
                      : "bg-red-500"
                }`}
              />
              <Text className={`text-sm font-medium ${availability.color}`}>
                {spot.available} available
              </Text>
            </View>
          </View>

          {/* Distance & Walking Time */}
          <View className="flex-row items-center justify-between mt-2">
            <Text className="text-xs text-gray-500">
              {spot.distance} km • {spot.walkingTime} walk
            </Text>
            <View className="flex-row">
              {spot.amenities.slice(0, 2).map((amenity, index) => (
                <View
                  key={index}
                  className="bg-gray-100 rounded-full px-2 py-1 ml-1"
                >
                  <Text className="text-xs text-gray-600">{amenity}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ParkingSpotCard;
