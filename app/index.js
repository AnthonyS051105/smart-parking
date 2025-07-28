import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";

const { width: screenWidth } = Dimensions.get("window");

export default function HomePage() {
  return (
    <LinearGradient
      colors={["#4B919B", "#093E47"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 32,
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
            marginBottom: 32,
            fontSize: screenWidth * 0.08,
            fontFamily: "Poppins-Bold",
          }}
        >
          Welcome to EasyParking
        </Text>

        <Link href="/auth/identitas" asChild>
          <TouchableOpacity
            style={{
              backgroundColor: "#4B919B",
              borderRadius: 25,
              paddingVertical: 16,
              paddingHorizontal: 32,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.3,
              shadowRadius: 6,
              elevation: 8,
            }}
            activeOpacity={0.8}
          >
            <Text
              style={{
                color: "#2D2B2E",
                textAlign: "center",
                fontSize: screenWidth * 0.04,
                fontFamily: "Poppins-SemiBold",
              }}
            >
              Get Started
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </LinearGradient>
  );
}
