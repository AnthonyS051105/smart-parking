"use client";

import { useState } from "react";
import { View, Text, ScrollView, Alert, Image } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import {
  GradientBackground,
  DecorativeCircles,
  HeaderNavigation,
  Button,
  Input,
  Divider,
  Card,
} from "../../components";
import { useForm } from "../../hooks/useForm";
import { validateEmail, validateRequired } from "../../utils/validation";
import {
  getResponsivePadding,
  getResponsiveFontSize,
  isDesktop,
} from "../../utils/responsive";
import { SHADOWS, COLORS } from "../../utils/styles";

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();
  const padding = getResponsivePadding(20);
  const desktop = isDesktop();

  const { values, errors, touched, setValue, setFieldTouched, validateAll } =
    useForm(
      {
        email: "",
        password: "",
      },
      {
        email: (email) =>
          validateRequired(email, "Email").isValid
            ? validateEmail(email)
              ? { isValid: true }
              : { error: "Please enter a valid email" }
            : validateRequired(email, "Email"),
        password: (password) => validateRequired(password, "Password"),
      }
    );

  const handleLogin = async () => {
    if (!validateAll()) {
      Alert.alert("Validation Error", "Please enter valid email and password");
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(values.email, values.password);

      if (result.success) {
        Alert.alert("Success", "Logged in successfully!", [
          { text: "OK", onPress: () => router.replace("/") },
        ]);
      } else {
        Alert.alert("Error", result.error || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      console.log("🔐 Starting Google login...");
      const result = await loginWithGoogle();

      if (result.success) {
        Alert.alert("Success", "Logged in with Google successfully!", [
          { text: "OK", onPress: () => router.replace("/") },
        ]);
      } else {
        Alert.alert(
          "Error",
          result.error || "Google login failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Google login error:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Forgot Password",
      "Password reset functionality will be implemented soon."
    );
  };

  const handleCreateAccount = () => {
    router.push("/auth/signup");
  };

  return (
    <GradientBackground>
      {/* Decorative Circles */}
      <DecorativeCircles variant="bottom-right" />

      {/* Header */}
      <HeaderNavigation />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "flex-start",
          paddingTop: desktop ? 80 : 25,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={{ alignItems: "center", marginBottom: desktop ? 20 : 32 }}>
          <Text
            className="text-center"
            style={{
              color: COLORS.text.white,
              fontSize: getResponsiveFontSize(40),
              fontFamily: "Poppins-ExtraBold",
              lineHeight: getResponsiveFontSize(46),
              ...SHADOWS.textTitle,
            }}
          >
            Welcome{"\n"}Back
          </Text>
        </View>

        <View style={{ marginHorizontal: padding }}>
          {/* Google Log In Button */}
          <Button
            title="Log in with Google"
            onPress={handleGoogleLogin}
            variant="secondary"
            size="sm"
            disabled={isLoading}
            borderRadius={23}
            icon={
              <Image
                source={require("../../assets/icons/Vector.png")}
                style={{
                  width: 18,
                  height: 18,
                  marginRight: 10,
                }}
                resizeMode="contain"
              />
            }
          />

          {/* Divider */}
          <Divider lineMargin={13} />
        </View>

        {/* Form Card - Menggunakan styling manual untuk mempertahankan tampilan yang sama */}
        <View
          style={{
            backgroundColor: COLORS.background.card,
            borderRadius: 24,
            padding: desktop ? padding * 1.5 : padding,
            paddingHorizontal: desktop ? padding * 1.8 : padding * 1,
            paddingTop: desktop ? padding * 2 : padding * 1.5,
            marginHorizontal: padding,
            marginBottom: padding,
            ...SHADOWS.card,
          }}
        >
          {/* Input Fields - ✅ Fixed error display */}
          <Input
            label="Email Address"
            value={values.email}
            onChangeText={(value) => setValue("email", value)}
            onBlur={() => setFieldTouched("email")}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            error={touched.email && errors.email?.error}
            backgroundColor={COLORS.background.input}
          />

          <Input
            label="Password"
            value={values.password}
            onChangeText={(value) => setValue("password", value)}
            onBlur={() => setFieldTouched("password")}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            showPasswordToggle={true}
            error={touched.password && errors.password?.error}
            backgroundColor={COLORS.background.input}
          />

          {/* Forgot Password - Changed to clickable text */}
          <View
            style={{ alignItems: "flex-end", marginTop: 2, marginBottom: 20 }}
          >
            <Text
              onPress={handleForgotPassword}
              style={{
                fontSize: getResponsiveFontSize(12),
                fontFamily: "Poppins-Regular",
                color: COLORS.text.secondary,
                textDecorationLine: "underline",
              }}
            >
              Forgot Password?
            </Text>
          </View>

          {/* Login Button */}
          <Button
            title={isLoading ? "Signing In..." : "Sign In"}
            onPress={handleLogin}
            style={{ width: "95%", alignSelf: "center" }}
            variant="signup"
            size="sm"
            disabled={isLoading}
            borderRadius={24}
          />

          {/* Create Account Link - Changed to text with clickable part */}
          <View style={{ alignItems: "center", marginTop: 16 }}>
            <Text
              style={{
                fontSize: getResponsiveFontSize(12),
                fontFamily: "Poppins-Regular",
                color: COLORS.text.secondary,
              }}
            >
              Don't have an account?{" "}
              <Text
                onPress={handleCreateAccount}
                style={{
                  color: COLORS.primary.dark,
                  fontFamily: "Poppins-SemiBold",
                  textDecorationLine: "underline",
                }}
              >
                Create one
              </Text>
            </Text>
          </View>
        </View>

        {/* Bottom spacer */}
        <View style={{ height: padding }} />
      </ScrollView>
    </GradientBackground>
  );
}
