"use client";

import { View, Text, TouchableOpacity, Dimensions, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function Status() {
  const router = useRouter();

  const handleBackToIdentity = () => {
    router.back();
  };

  const handleGetStarted = () => {
    // Implementasi untuk get started
    console.log("Get Started pressed");
  };

  const handleAlreadyHaveAccount = () => {
    // Implementasi untuk already have account
    console.log("Already have account pressed");
  };

  return (
    <LinearGradient
      className="flex-1"
      colors={["#4B919B", "#093E47"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      {/* Status Bar Area */}
      <View className="pt-12 pb-4" style={{ zIndex: 10 }}>
        {/* Top Navigation */}
        <View
          className="flex-row justify-between items-center px-6"
          style={{ zIndex: 10 }}
        >
          <TouchableOpacity
            onPress={handleBackToIdentity}
            className="py-2 px-2"
            activeOpacity={0.7}
            style={{ zIndex: 10 }}
          >
            <Text
              className="text-white"
              style={{
                fontSize: screenWidth * 0.035,
                fontFamily: "Poppins-Bold",
              }}
            >
              BACK
            </Text>
          </TouchableOpacity>

          <Text
            className="text-[#D0FCFF]"
            style={{
              fontSize: screenWidth * 0.035,
              fontFamily: "Poppins-SemiBold", // Weight 600
            }}
          >
            User
          </Text>

          {/* Empty view for spacing */}
          <View style={{ width: 50 }} />
        </View>
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
          {/* Apple Logo */}
          <View className="mb-8">
            <Image
              source={require("../../assets/icons/465abb021f7ccecbf70e8303bed15887815b29fb.png")}
              className="shadow-2xl drop-shadow-xl/50"
              style={{
                width: screenWidth * 0.35,
                height: screenWidth * 0.35,
              }}
            />
          </View>

          {/* App Title */}
          <Text
            className="text-[#CEF1F3] text-center"
            style={{
              fontSize: screenWidth * 0.09,
              fontFamily: "Poppins-Bold",
              letterSpacing: 1,
            }}
          >
            EasyParking
          </Text>
        </View>
      </View>

      {/* Bottom Section */}
      <View className="pb-24 px-8">
        {/* Get Started Button */}
        <TouchableOpacity
          onPress={handleGetStarted}
          className="bg-primary-light rounded-full py-4 mb-6"
          activeOpacity={0.8}
          style={{
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 8,
          }}
        >
          <Text
            className="text-#2D2B2E text-center"
            style={{
              fontSize: screenWidth * 0.04,
              fontFamily: "Poppins-Bold",
              letterSpacing: 1,
            }}
          >
            GET STARTED
          </Text>
        </TouchableOpacity>

        {/* Already Have Account */}
        <TouchableOpacity
          onPress={handleAlreadyHaveAccount}
          className="py-3"
          activeOpacity={0.7}
        >
          <Text
            className="text-white text-center"
            style={{
              fontSize: screenWidth * 0.035,
              fontFamily: "Poppins-Bold",
              letterSpacing: 0.5,
            }}
          >
            I ALREADY HAVE AN ACCOUNT
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
