import React from "react";
import { View, TextInput, TouchableOpacity, Image } from "react-native";

const SearchBar = ({
  value,
  onChangeText,
  onSearch,
  placeholder = "Search here",
}) => {
  return (
    <View className="absolute top-16 left-4 right-4 z-20">
      <View className="bg-white rounded-2xl shadow-lg border border-gray-100 flex-row items-center px-4 py-3">
        {/* Search Icon */}
        <Image
          source={require("../../assets/icons/search-location.png")}
          className="w-5 h-5 mr-3 opacity-60"
          resizeMode="contain"
        />

        {/* Text Input */}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          className="flex-1 text-gray-900 text-base"
          onSubmitEditing={onSearch}
          returnKeyType="search"
        />

        {/* Search Button */}
        {value.length > 0 && (
          <TouchableOpacity
            onPress={onSearch}
            className="bg-blue-600 w-8 h-8 rounded-full items-center justify-center ml-2"
            activeOpacity={0.8}
          >
            <Image
              source={require("../../assets/icons/arrow.png")}
              className="w-4 h-4"
              style={{ tintColor: "#ffffff" }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default SearchBar;
