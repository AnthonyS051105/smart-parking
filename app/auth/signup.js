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
} from "../../components";
import { useForm } from "../../hooks/useForm";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateRequired,
  validatePhoneNumber,
  validateFullName,
} from "../../utils/validation";
import {
  getResponsivePadding,
  getResponsiveFontSize,
  isDesktop,
} from "../../utils/responsive";
import { SHADOWS, COLORS } from "../../utils/styles";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { signup } = useAuth();
  const padding = getResponsivePadding(20);
  const desktop = isDesktop();

  // ✅ Define validation rules with proper format
  const validationRules = {
    fullName: (value) => validateFullName(value),
    email: (value) => validateEmail(value),
    phoneNumber: (value) => validatePhoneNumber(value),
    password: (value) => validatePassword(value),
    confirmPassword: (value) => validateConfirmPassword(values.password, value),
  };

  const { values, errors, touched, setValue, setFieldTouched, validateAll } =
    useForm(
      {
        fullName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
      },
      validationRules
    );

  const handleCreateAccount = async () => {
    console.log("🚀 Starting signup process...");

    // ✅ Use the fixed validateAll function
    const isValid = validateAll();

    if (!isValid) {
      console.log("❌ Validation failed:", errors);
      Alert.alert("Validation Error", "Please fill in all fields correctly");
      return;
    }

    setIsLoading(true);
    try {
      console.log("📝 Calling signup with:", {
        email: values.email,
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        passwordLength: values.password.length,
      });

      const result = await signup(
        values.email.trim(),
        values.password.trim(),
        values.fullName.trim(),
        values.phoneNumber.trim()
      );

      console.log("📡 Signup result:", result);

      if (result.success) {
        Alert.alert("Success", "Account created successfully!", [
          { text: "OK", onPress: () => router.replace("/") },
        ]);
      } else {
        Alert.alert(
          "Error",
          result.error || "Failed to create account. Please try again."
        );
      }
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    console.log("Google Sign Up");
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
            Sign Up
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
          {/* Google Sign Up Button */}
          <Button
            title="Sign up with Google"
            onPress={handleGoogleSignUp}
            variant="secondary"
            size="md"
            className="mb-6"
            disabled={isLoading}
          />

          {/* Divider */}
          <Divider />

          {/* Input Fields - ✅ Fixed error display */}
          <Input
            label="Full Name"
            value={values.fullName}
            onChangeText={(value) => setValue("fullName", value)}
            onBlur={() => setFieldTouched("fullName")}
            placeholder="Enter your full name"
            error={touched.fullName && errors.fullName}
          />

          <Input
            label="Email Address"
            value={values.email}
            onChangeText={(value) => setValue("email", value)}
            onBlur={() => setFieldTouched("email")}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            error={touched.email && errors.email}
          />

          <Input
            label="Phone Number"
            value={values.phoneNumber}
            onChangeText={(value) => setValue("phoneNumber", value)}
            onBlur={() => setFieldTouched("phoneNumber")}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            error={touched.phoneNumber && errors.phoneNumber}
          />

          <Input
            label="Password"
            value={values.password}
            onChangeText={(value) => setValue("password", value)}
            onBlur={() => setFieldTouched("password")}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            showPasswordToggle={true}
            error={touched.password && errors.password}
          />

          <Input
            label="Confirm Password"
            value={values.confirmPassword}
            onChangeText={(value) => setValue("confirmPassword", value)}
            onBlur={() => setFieldTouched("confirmPassword")}
            placeholder="Confirm your password"
            secureTextEntry={!showConfirmPassword}
            showPasswordToggle={true}
            className="mb-8"
            style={{ marginBottom: 32 }}
            error={touched.confirmPassword && errors.confirmPassword}
          />

          {/* Create Account Button */}
          <Button
            title={isLoading ? "Creating Account..." : "Create Account"}
            onPress={handleCreateAccount}
            variant="primary"
            size="lg"
            disabled={isLoading}
          />
        </View>

        {/* Bottom spacer */}
        <View style={{ height: padding }} />
      </ScrollView>
    </GradientBackground>
  );
}
