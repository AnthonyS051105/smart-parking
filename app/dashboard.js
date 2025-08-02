import React from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import {
  GradientBackground,
  DecorativeCircles,
  HeaderNavigation,
  Logo,
  CustomButton,
} from "../components";
import {
  getResponsivePadding,
  getResponsiveFontSize,
} from "../utils/responsive";
import { COLORS, SHADOWS } from "../utils/styles";

export default function DashboardPage() {
  const padding = getResponsivePadding(20);
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          console.log("🚪 Logging out user...");
          await logout();
          console.log("✅ Logout successful, redirecting to home");
          router.replace("/");
        },
      },
    ]);
  };

  return (
    <GradientBackground>
      <DecorativeCircles variant="scattered" opacity={0.2} />

      {/* ✅ Keep existing HeaderNavigation for debugging */}
      <HeaderNavigation
        title="Dashboard"
        showBack={false}
        rightAction={{
          title: "Logout",
          onPress: handleLogout,
        }}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding }}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <View style={{ alignItems: "center", marginBottom: 40 }}>
          <Logo size="medium" />

          <Text
            style={{
              color: COLORS.text.white,
              fontSize: getResponsiveFontSize(24),
              fontFamily: "Poppins-Bold",
              marginTop: 20,
              textAlign: "center",
              ...SHADOWS.text,
            }}
          >
            Welcome back, {user?.fullName || user?.name || "User"}!
          </Text>

          <Text
            style={{
              color: COLORS.primary.text,
              fontSize: getResponsiveFontSize(16),
              fontFamily: "Poppins-Regular",
              marginTop: 8,
              textAlign: "center",
              ...SHADOWS.text,
            }}
          >
            Your smart parking solution
          </Text>
        </View>

        {/* ✅ ADD: Manual Logout Button for testing */}
        <View
          style={{
            backgroundColor: COLORS.background.card,
            borderRadius: 20,
            padding: padding * 1.5,
            marginBottom: 20,
            ...SHADOWS.card,
          }}
        >
          <Text
            style={{
              fontSize: getResponsiveFontSize(18),
              fontFamily: "Poppins-Bold",
              color: COLORS.text.primary,
              marginBottom: 16,
            }}
          >
            Account Actions
          </Text>

          <CustomButton
            title="🚪 Logout & Test Login"
            onPress={handleLogout}
            variant="outline"
            size="medium"
            containerStyle={{ marginBottom: 12 }}
          />

          <Text
            style={{
              fontSize: getResponsiveFontSize(12),
              fontFamily: "Poppins-Regular",
              color: COLORS.text.secondary,
              textAlign: "center",
              marginTop: 8,
            }}
          >
            Tap logout to test the login flow
          </Text>
        </View>

        {/* Feature Cards */}
        <View
          style={{
            backgroundColor: COLORS.background.card,
            borderRadius: 20,
            padding: padding * 1.5,
            marginBottom: 20,
            ...SHADOWS.card,
          }}
        >
          <Text
            style={{
              fontSize: getResponsiveFontSize(18),
              fontFamily: "Poppins-Bold",
              color: COLORS.text.primary,
              marginBottom: 16,
            }}
          >
            Quick Actions
          </Text>

          <CustomButton
            title="Find Parking Spot"
            onPress={() => console.log("Find parking")}
            variant="primary"
            size="large"
            containerStyle={{ marginBottom: 12 }}
          />

          <CustomButton
            title="View My Bookings"
            onPress={() => console.log("View bookings")}
            variant="secondary"
            size="medium"
            containerStyle={{ marginBottom: 12 }}
          />

          <CustomButton
            title="Account Settings"
            onPress={() => console.log("Settings")}
            variant="outline"
            size="medium"
          />
        </View>

        {/* Stats Card */}
        <View
          style={{
            backgroundColor: COLORS.background.card,
            borderRadius: 20,
            padding: padding * 1.5,
            marginBottom: 20,
            ...SHADOWS.card,
          }}
        >
          <Text
            style={{
              fontSize: getResponsiveFontSize(18),
              fontFamily: "Poppins-Bold",
              color: COLORS.text.primary,
              marginBottom: 16,
            }}
          >
            Your Stats
          </Text>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ alignItems: "center", flex: 1 }}>
              <Text
                style={{
                  fontSize: getResponsiveFontSize(24),
                  fontFamily: "Poppins-Bold",
                  color: COLORS.primary.dark,
                }}
              >
                12
              </Text>
              <Text
                style={{
                  fontSize: getResponsiveFontSize(12),
                  fontFamily: "Poppins-Regular",
                  color: COLORS.text.secondary,
                }}
              >
                Total Bookings
              </Text>
            </View>

            <View style={{ alignItems: "center", flex: 1 }}>
              <Text
                style={{
                  fontSize: getResponsiveFontSize(24),
                  fontFamily: "Poppins-Bold",
                  color: COLORS.primary.dark,
                }}
              >
                3
              </Text>
              <Text
                style={{
                  fontSize: getResponsiveFontSize(12),
                  fontFamily: "Poppins-Regular",
                  color: COLORS.text.secondary,
                }}
              >
                Active Bookings
              </Text>
            </View>

            <View style={{ alignItems: "center", flex: 1 }}>
              <Text
                style={{
                  fontSize: getResponsiveFontSize(24),
                  fontFamily: "Poppins-Bold",
                  color: COLORS.primary.dark,
                }}
              >
                48h
              </Text>
              <Text
                style={{
                  fontSize: getResponsiveFontSize(12),
                  fontFamily: "Poppins-Regular",
                  color: COLORS.text.secondary,
                }}
              >
                Total Hours
              </Text>
            </View>
          </View>
        </View>

        {/* ✅ ADD: Debug Info */}
        <View
          style={{
            backgroundColor: COLORS.background.card,
            borderRadius: 20,
            padding: padding,
            marginBottom: 20,
            ...SHADOWS.card,
          }}
        >
          <Text
            style={{
              fontSize: getResponsiveFontSize(14),
              fontFamily: "Poppins-Bold",
              color: COLORS.text.primary,
              marginBottom: 8,
            }}
          >
            Debug Info
          </Text>
          <Text
            style={{
              fontSize: getResponsiveFontSize(12),
              fontFamily: "Poppins-Regular",
              color: COLORS.text.secondary,
            }}
          >
            User: {user?.email || "No email"}
          </Text>
          <Text
            style={{
              fontSize: getResponsiveFontSize(12),
              fontFamily: "Poppins-Regular",
              color: COLORS.text.secondary,
            }}
          >
            Name: {user?.fullName || "No name"}
          </Text>
        </View>

        {/* Bottom spacer */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </GradientBackground>
  );
}
