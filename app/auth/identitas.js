"use client";

import { View, Text, TouchableOpacity, Dimensions, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function Identitas() {
  const router = useRouter();

  const handleUserLogin = () => {
    router.push("/auth/status");
  };

  const handleAdminLogin = () => {
    // Implementasi untuk admin login
  };

  return (
    <LinearGradient
      className="flex-1"
      colors={["#4B919B", "#093E47"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      {/* Decorative Circles - Top */}
      <View className="absolute inset-0 opacity-40">
        <View
          className="absolute bg-primary-light rounded-full"
          style={{
            width: screenWidth * 0.5,
            height: screenWidth * 0.5,
            left: screenWidth * 0.15,
            top: -screenWidth * 0.17,
          }}
        />
        <View
          className="absolute bg-primary-light rounded-full"
          style={{
            width: screenWidth * 0.5,
            height: screenWidth * 0.5,
            left: -screenWidth * 0.18,
            top: -screenWidth * 0.06,
          }}
        />
      </View>

      {/* Decorative Circles - Bottom */}
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

      {/* Main Content */}
      <View className="flex-1 justify-center items-center px-8">
        {/* Logo Section */}
        <View className="items-center mb-16">
          {/* Apple-like logo placeholder */}
          <Image
            source={require("../../assets/icons/465abb021f7ccecbf70e8303bed15887815b29fb.png")}
            className="shadow-2xl drop-shadow-xl/50"
            style={{
              width: screenWidth * 0.35,
              height: screenWidth * 0.35,
            }}
          />

          {/* App Title */}
          <Text
            className="text-primary-text text-center drop-shadow-lg"
            style={{
              fontSize: screenWidth * 0.11,
              fontFamily: "Poppins-Bold",
            }}
          >
            EasyParking
          </Text>
        </View>

        {/* Login Section */}
        <View className="w-full items-center">
          {/* Login Text */}
          <Text
            className="text-white mb-8 text-center"
            style={{
              fontSize: screenWidth * 0.04,
              fontFamily: "Poppins-Medium",
            }}
          >
            Log in as:
          </Text>

          {/* Login Buttons */}
          <View className="w-full space-y-4">
            <TouchableOpacity
              onPress={handleUserLogin}
              className="bg-primary rounded-full py-4 mx-4"
              activeOpacity={0.8}
              style={{
                // Shadow untuk iOS
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: 0.3,
                shadowRadius: 6,
                // Shadow untuk Android
                elevation: 8,
              }}
            >
              <Text
                className="text-#2D2B2E text-center"
                style={{
                  fontSize: screenWidth * 0.038,
                  fontFamily: "Poppins-SemiBold",
                }}
              >
                User
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-primary rounded-full py-4 mx-4 shadow-lg mt-4"
              activeOpacity={0.8}
            >
              <Text
                className="text-#2D2B2E text-center"
                style={{
                  fontSize: screenWidth * 0.038,
                  fontFamily: "Poppins-SemiBold",
                }}
              >
                Administrator
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
