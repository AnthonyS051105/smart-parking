"use client";

import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const { width: screenWidth } = Dimensions.get("window");

export default function Status() {
  const router = useRouter();

  const handleBackToIdentity = () => {
    router.back();
  };

  return (
    <LinearGradient
      className="flex-1"
      colors={["#4B919B", "#093E47"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <View className="top-8 flex flex-row">
        <View className="" style={{ justifyContent: "center" }}>
          <TouchableOpacity
            onPress={handleBackToIdentity}
            className="px-6 py-3 rounded-lg"
          >
            <Text
              className="text-white"
              style={{
                fontFamily: "Poppins-Bold",
              }}
            >
              Back
            </Text>
          </TouchableOpacity>
        </View>

        <Text
          className="text-[#D0FCFF] text-md mb-8"
          style={{
            fontFamily: "Poppins-SemiBold",
          }}
        >
          User
        </Text>
      </View>
    </LinearGradient>
  );
}
