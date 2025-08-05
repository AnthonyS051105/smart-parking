import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getResponsivePadding,
  getResponsiveFontSize,
} from "../../utils/responsive";
import { SHADOWS, COLORS } from "../../utils/styles";

/**
 * Input component dengan manual styling untuk konsistensi dengan design awal
 *
 * Props:
 * - label: string - Label untuk input
 * - value: string - Value input
 * - onChangeText: function - Handler perubahan text
 * - placeholder: string - Placeholder text
 * - error: string - Error message
 * - secureTextEntry: boolean - Password input
 * - showPasswordToggle: boolean - Show password toggle button
 * - keyboardType: string - Keyboard type
 * - autoCapitalize: string - Auto capitalize setting
 * - disabled: boolean - Disabled state
 */
export default function Input({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder = "",
  error = "",
  secureTextEntry = false,
  showPasswordToggle = false,
  keyboardType = "default",
  autoCapitalize = "sentences",
  disabled = false,
  style = {},
  backgroundColor = "rgba(255, 255, 255, 0.1)",
  inputWidth,
  ...props
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handlePasswordToggle = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur();
  };

  const getContainerStyle = () => ({
    marginBottom: getResponsivePadding(8),
    ...style,
  });

  const getLabelStyle = () => ({
    color: COLORS.text.secondary,
    fontSize: getResponsiveFontSize(12),
    fontFamily: "Poppins-SemiBold",
    marginBottom: getResponsivePadding(2),
    marginLeft: getResponsivePadding(4),
  });

  const getInputContainerStyle = () => ({
    backgroundColor: backgroundColor,
    borderRadius: 11,
    paddingHorizontal: getResponsivePadding(16),
    paddingVertical: getResponsivePadding(6), // Sesuaikan paddingVertical untuk pusatkan teks
    flexDirection: "row",
    alignItems: "center", // Pastikan alignItems tetap center
    borderWidth: 1,
    borderColor: error
      ? COLORS.error.DEFAULT
      : isFocused
        ? COLORS.primary.dark
        : "rgba(255, 255, 255, 0.2)",
    opacity: disabled ? 0.5 : 1,
    width: inputWidth,
    height: 45, // Tetap gunakan height 48
    justifyContent: "space-between", // Pastikan toggle button tidak mengganggu teks
  });

  const getInputStyle = () => ({
    flex: 1,
    color: COLORS.text.primary,
    fontSize: getResponsiveFontSize(12),
    fontFamily: "Poppins-Regular",
    textAlignVertical: "center", // Pastikan teks terpusat secara vertikal
    paddingVertical: 0, // Hilangkan padding internal
    includeFontPadding: false, // Hindari padding font bawaan
  });

  const getErrorStyle = () => ({
    color: COLORS.error.DEFAULT,
    fontSize: getResponsiveFontSize(12),
    fontFamily: "Poppins-Medium",
    marginTop: getResponsivePadding(4),
    marginLeft: getResponsivePadding(4),
  });

  return (
    <View style={getContainerStyle()}>
      {/* Label */}
      {label && <Text style={getLabelStyle()}>{label}</Text>}

      {/* Input Container */}
      <View style={getInputContainerStyle()}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor="#A0A0A0" // Warna kontras untuk placeholder
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={!disabled}
          style={getInputStyle()}
          multiline={false}
          {...props}
        />

        {/* Password Toggle Button */}
        {showPasswordToggle && (
          <TouchableOpacity
            onPress={handlePasswordToggle}
            style={{
              padding: getResponsivePadding(4),
            }}
            disabled={disabled}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={20}
              color="#2F6E77"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Error Message */}
      {error && <Text style={getErrorStyle()}>{error}</Text>}
    </View>
  );
}
