import React from "react";
import { View, TouchableOpacity, Image } from "react-native";

const BottomNavigation = ({ activeTab = "parking", onTabPress }) => {
  const tabs = [
    {
      id: "home",
      icon: require("../../assets/icons/home.png"),
    },
    {
      id: "favorite",
      icon: require("../../assets/icons/love.png"),
    },
    {
      id: "parking",
      icon: require("../../assets/icons/car.png"),
      isCenter: true,
    },
    {
      id: "history",
      icon: require("../../assets/icons/history.png"),
    },
    {
      id: "profile",
      icon: require("../../assets/icons/user-alt.png"),
    },
  ];

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white shadow-2xl">
      <View className="flex-row items-center justify-around py-3 px-4">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            className={`flex-1 items-center justify-center py-2 ${
              tab.isCenter ? "" : "px-4"
            }`}
            onPress={() => onTabPress && onTabPress(tab.id)}
          >
            {tab.isCenter ? (
              <View className="w-14 h-14 bg-teal-700 rounded-full items-center justify-center shadow-lg">
                <Image
                  source={tab.icon}
                  className="w-7 h-7"
                  style={{ tintColor: "white" }}
                />
              </View>
            ) : (
              <Image
                source={tab.icon}
                className="w-6 h-6"
                style={{
                  tintColor: activeTab === tab.id ? "#0f766e" : "#9ca3af",
                }}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default BottomNavigation;
