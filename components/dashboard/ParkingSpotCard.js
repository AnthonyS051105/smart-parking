import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

const ParkingSpotCard = ({
  spot,
  isSelected = false,
  onPress,
  onStartNavigation,
  isNavigating = false,
  navigationState = "idle",
  showNavigationButton = false,
}) => {
  const getAvailabilityColor = () => {
    if (spot.available === 0) return "text-red-500";
    if (spot.available <= 2) return "text-yellow-500";
    return "text-green-500";
  };

  const getAvailabilityBg = () => {
    if (spot.available === 0) return "bg-red-50 border-red-200";
    if (spot.available <= 2) return "bg-yellow-50 border-yellow-200";
    return "bg-green-50 border-green-200";
  };

  const formatDistance = (distance) => {
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(1)} km`;
    }
    return `${Math.round(distance)} m`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`rounded-xl p-4 border-2 shadow-sm ${
        isSelected
          ? "bg-blue-50 border-blue-300 shadow-md"
          : "bg-white border-gray-200"
      }`}
      activeOpacity={0.7}
    >
      <View className="flex-row items-start justify-between">
        {/* Main Content */}
        <View className="flex-1 mr-3">
          {/* Spot Name */}
          <Text
            className={`text-lg font-bold mb-1 ${
              isSelected ? "text-blue-900" : "text-gray-900"
            }`}
          >
            {spot.name || `CCM Basement`}
          </Text>

          {/* Location */}
          <View className="flex-row items-center mb-2">
            <Image
              source={require("../../assets/icons/search-location.png")}
              className="w-4 h-4 mr-2 opacity-60"
              resizeMode="contain"
            />
            <Text className="text-gray-600 text-sm flex-1">
              {spot.address || spot.description || "Parking location"}
            </Text>
          </View>

          {/* Distance and Price */}
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Image
                source={require("../../assets/icons/arrow.png")}
                className="w-4 h-4 mr-1 opacity-60"
                resizeMode="contain"
              />
              <Text className="text-gray-500 text-sm">
                {formatDistance(spot.distance || 500)}
              </Text>
            </View>

            <Text className="text-gray-900 font-semibold">
              {formatPrice(spot.hourlyRate || 5000)}/hour
            </Text>
          </View>

          {/* Availability Status */}
          <View
            className={`px-3 py-2 rounded-lg border ${getAvailabilityBg()}`}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Image
                  source={require("../../assets/icons/car.png")}
                  className="w-4 h-4 mr-2 opacity-80"
                  resizeMode="contain"
                />
                <Text className={`font-medium ${getAvailabilityColor()}`}>
                  {spot.available} spaces available
                </Text>
              </View>

              {/* Security/Features Badge */}
              {spot.features?.includes("security") && (
                <View className="bg-blue-100 px-2 py-1 rounded-full">
                  <Text className="text-blue-600 text-xs font-medium">
                    🔒 Secure
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Action Button */}
        <View className="items-end">
          {showNavigationButton && !isNavigating && (
            <TouchableOpacity
              onPress={onStartNavigation}
              className="bg-blue-600 px-4 py-2 rounded-lg flex-row items-center"
              activeOpacity={0.8}
            >
              <Image
                source={require("../../assets/icons/arrow.png")}
                className="w-4 h-4 mr-2 tint-white"
                resizeMode="contain"
                style={{ tintColor: "white" }}
              />
              <Text className="text-white font-medium text-sm">Navigate</Text>
            </TouchableOpacity>
          )}

          {isNavigating && isSelected && (
            <View className="bg-green-600 px-4 py-2 rounded-lg flex-row items-center">
              <View className="w-3 h-3 bg-white rounded-full mr-2" />
              <Text className="text-white font-medium text-sm">
                {navigationState === "calculating"
                  ? "Calculating..."
                  : "Navigating"}
              </Text>
            </View>
          )}

          {!showNavigationButton && !isNavigating && (
            <View className="items-center">
              {/* Rating */}
              <View className="flex-row items-center mb-2">
                <Text className="text-yellow-500 text-sm mr-1">⭐</Text>
                <Text className="text-gray-600 text-sm">
                  {spot.rating || "4.5"}
                </Text>
              </View>

              {/* Quick Actions */}
              <View className="flex-row space-x-2">
                <TouchableOpacity className="bg-gray-100 p-2 rounded-lg">
                  <Image
                    source={require("../../assets/icons/love.png")}
                    className="w-4 h-4 opacity-60"
                    resizeMode="contain"
                  />
                </TouchableOpacity>

                <TouchableOpacity className="bg-gray-100 p-2 rounded-lg">
                  <Image
                    source={require("../../assets/icons/history.png")}
                    className="w-4 h-4 opacity-60"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Additional Info */}
      {isSelected && (
        <View className="mt-3 pt-3 border-t border-gray-200">
          <View className="flex-row items-center justify-between">
            <View className="flex-row space-x-4">
              {/* Operating Hours */}
              <View>
                <Text className="text-gray-500 text-xs">Hours</Text>
                <Text className="text-gray-900 text-sm font-medium">
                  {spot.hours || "24/7"}
                </Text>
              </View>

              {/* Payment Methods */}
              <View>
                <Text className="text-gray-500 text-xs">Payment</Text>
                <Text className="text-gray-900 text-sm font-medium">
                  {spot.paymentMethods?.join(", ") || "Cash, Card"}
                </Text>
              </View>
            </View>

            {/* More Info Button */}
            <TouchableOpacity className="bg-gray-100 px-3 py-2 rounded-lg">
              <Text className="text-gray-600 text-sm">More Info</Text>
            </TouchableOpacity>
          </View>

          {/* Features */}
          {spot.features && spot.features.length > 0 && (
            <View className="mt-3">
              <Text className="text-gray-500 text-xs mb-2">Features</Text>
              <View className="flex-row flex-wrap">
                {spot.features.map((feature, index) => (
                  <View
                    key={index}
                    className="bg-blue-100 px-2 py-1 rounded-full mr-2 mb-1"
                  >
                    <Text className="text-blue-600 text-xs">{feature}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ParkingSpotCard;
