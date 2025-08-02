"use client";

import { useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
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
  const { login } = useAuth();
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

  const handleGoogleLogin = () => {
    console.log("Google Login");
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
      <DecorativeCircles variant="scattered" />

      {/* Header */}
      <HeaderNavigation />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={{ alignItems: "center", marginBottom: desktop ? 40 : 48 }}>
          <Text
            style={{
              color: COLORS.text.white,
              fontSize: getResponsiveFontSize(40),
              fontFamily: "Poppins-Bold",
              ...SHADOWS.textTitle,
            }}
          >
            Sign In
          </Text>
        </View>

        {/* Form Card - Menggunakan styling manual untuk mempertahankan tampilan yang sama */}
        <View
          style={{
            backgroundColor: COLORS.background.card,
            borderRadius: 24,
            padding: desktop ? padding * 1.5 : padding,
            marginHorizontal: padding,
            marginBottom: padding,
            ...SHADOWS.card,
          }}
        >
          {/* Google Login Button */}
          <Button
            title="Sign in with Google"
            onPress={handleGoogleLogin}
            variant="secondary"
            size="md"
            className="mb-6"
            disabled={isLoading}
          />

          {/* Divider */}
          <Divider />

          {/* Input Fields */}
          <Input
            label="Email Address"
            value={values.email}
            onChangeText={(value) => setValue("email", value)}
            onBlur={() => setFieldTouched("email")}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            error={touched.email && errors.email?.error}
          />

          <Input
            label="Password"
            value={values.password}
            onChangeText={(value) => setValue("password", value)}
            onBlur={() => setFieldTouched("password")}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            showPasswordToggle={true}
            className="mb-4"
            error={touched.password && errors.password?.error}
          />

          {/* Forgot Password */}
          <Button
            title="Forgot Password?"
            onPress={handleForgotPassword}
            variant="ghost"
            size="sm"
            className="self-end mb-8 w-auto"
            style={{
              alignSelf: "flex-end",
              marginBottom: 32,
              width: "auto",
            }}
            textStyle={{ color: COLORS.text.secondary }}
            disabled={isLoading}
          />

          {/* Login Button */}
          <Button
            title={isLoading ? "Signing In..." : "Sign In"}
            onPress={handleLogin}
            variant="primary"
            size="lg"
            className="mb-4"
            disabled={isLoading}
          />

          {/* Create Account Link */}
          <Button
            title="Don't have an account? Create one"
            onPress={handleCreateAccount}
            variant="ghost"
            size="md"
            textStyle={{ color: COLORS.text.secondary }}
            disabled={isLoading}
          />
        </View>

        {/* Bottom spacer */}
        <View style={{ height: padding }} />
      </ScrollView>
    </GradientBackground>
  );
}
