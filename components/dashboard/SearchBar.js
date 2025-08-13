import React from "react";
import { View, TextInput, TouchableOpacity, Image, Text } from "react-native";

const SearchBar = ({
  value,
  onChangeText,
  onSearch,
  placeholder = "Search here",
  className = "",
}) => {
  return (
    <View className={`absolute top-12 left-5 right-5 z-50 ${className}`}>
      <View className="flex-row items-center bg-teal-700 rounded-full px-4 py-3 shadow-lg">
        <Image
          source={require("../../assets/icons/search-location.png")}
          className="w-5 h-5 mr-3"
          style={{ tintColor: "white" }}
        />
        <TextInput
          className="flex-1 text-white text-base"
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.7)"
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSearch}
          returnKeyType="search"
        />
        {value && (
          <TouchableOpacity
            onPress={() => onChangeText("")}
            className="w-6 h-6 bg-white/20 rounded-full items-center justify-center ml-2"
          >
            <Text className="text-white text-sm font-bold">×</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default SearchBar;
