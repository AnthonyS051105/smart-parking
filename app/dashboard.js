import React, { useState, useCallback, useMemo, useRef } from "react";
import { View, StatusBar, Alert, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "../hooks/useLocation";
import { useNavigation } from "../hooks/useNavigation";

import MapboxMap from "../components/maps/MapboxMap";
import SearchBar from "../components/dashboard/SearchBar";
import DraggablePullUpPanel from "../components/dashboard/DraggablePullUpPanel";
import BottomNavigation from "../components/dashboard/BottomNavigation";
import LocationButton from "../components/dashboard/LocationButton";

import {
  parkingSpots,
  filterSpotsBySearch,
  sortSpotsByDistance,
} from "../data/parkingData";
import { MAPBOX_CONFIG } from "../utils/mapboxConfig";

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { location: userLocation } = useLocation();

  const mapRef = useRef(null);
  const [selectedSpotIndex, setSelectedSpotIndex] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("parking");

  const {
    isNavigating,
    route,
    instructions,
    currentStep,
    startNavigation,
    stopNavigation,
    updateNavigationProgress,
  } = useNavigation();

  // Filter and sort parking spots
  const filteredSpots = useMemo(() => {
    let filtered = filterSpotsBySearch(parkingSpots, searchText);
    return sortSpotsByDistance(filtered);
  }, [searchText]);

  // Prepare markers for map
  const mapMarkers = useMemo(
    () =>
      filteredSpots.map((spot, index) => ({
        ...spot,
        selected: selectedSpotIndex === index,
      })),
    [filteredSpots, selectedSpotIndex]
  );

  // Handle spot selection
  const handleSpotSelect = useCallback(
    (index) => {
      setSelectedSpotIndex(index);
      const selectedSpot = filteredSpots[index];

      // Move map to selected spot
      mapRef.current?.animateToLocation(
        selectedSpot.longitude,
        selectedSpot.latitude,
        MAPBOX_CONFIG.NAVIGATION_ZOOM
      );
    },
    [filteredSpots]
  );

  // Handle marker press on map
  const handleMarkerPress = useCallback(
    (index, markerData) => {
      handleSpotSelect(index);
    },
    [handleSpotSelect]
  );

  // Handle pull-up panel scroll
  const handlePanelScroll = useCallback(
    (index) => {
      handleSpotSelect(index);
    },
    [handleSpotSelect]
  );

  // Handle my location button
  const handleLocationPress = useCallback(() => {
    if (userLocation) {
      mapRef.current?.animateToLocation(
        userLocation.longitude,
        userLocation.latitude,
        MAPBOX_CONFIG.DEFAULT_ZOOM
      );
    }
  }, [userLocation]);

  // Handle search
  const handleSearch = useCallback(() => {
    if (filteredSpots.length > 0) {
      handleSpotSelect(0);
    }
  }, [filteredSpots, handleSpotSelect]);

  // Handle navigation
  const handleStartNavigation = useCallback(() => {
    if (userLocation && filteredSpots[selectedSpotIndex]) {
      const destination = {
        latitude: filteredSpots[selectedSpotIndex].latitude,
        longitude: filteredSpots[selectedSpotIndex].longitude,
      };

      startNavigation(userLocation, destination);
    }
  }, [userLocation, filteredSpots, selectedSpotIndex, startNavigation]);

  // Handle tab press
  const handleTabPress = useCallback(
    (tabId) => {
      setActiveTab(tabId);

      switch (tabId) {
        case "home":
          router.push("/");
          break;
        case "favorite":
          console.log("Navigate to Favorites");
          break;
        case "parking":
          // Current screen
          break;
        case "history":
          console.log("Navigate to History");
          break;
        case "profile":
          Alert.alert("Profile Options", "Choose an action", [
            { text: "Cancel", style: "cancel" },
            {
              text: "Logout",
              style: "destructive",
              onPress: async () => {
                await logout();
                router.replace("/");
              },
            },
          ]);
          break;
      }
    },
    [router, logout]
  );

  return (
    <View className="flex-1 bg-white">
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Map */}
      <MapboxMap
        ref={mapRef}
        center={
          userLocation
            ? [userLocation.longitude, userLocation.latitude]
            : MAPBOX_CONFIG.DEFAULT_CENTER
        }
        zoom={MAPBOX_CONFIG.DEFAULT_ZOOM}
        markers={mapMarkers}
        route={route}
        onMarkerPress={handleMarkerPress}
        followUser={isNavigating}
        showUserLocation={true}
        className="flex-1"
      />

      {/* Search Bar */}
      <SearchBar
        value={searchText}
        onChangeText={setSearchText}
        onSearch={handleSearch}
        placeholder="Search here"
      />

      {/* My Location Button */}
      <LocationButton onPress={handleLocationPress} />

      {/* Navigation Instructions (when navigating) */}
      {isNavigating && instructions[currentStep] && (
        <View className="absolute top-32 left-5 right-5 bg-blue-600 rounded-xl p-4 shadow-lg z-30">
          <Text className="text-white text-lg font-bold mb-1">
            {instructions[currentStep].maneuver.instruction}
          </Text>
          <Text className="text-blue-100 text-sm">
            In {Math.round(instructions[currentStep].distance)}m
          </Text>
          <TouchableOpacity
            className="absolute top-2 right-2 w-8 h-8 bg-white/20 rounded-full items-center justify-center"
            onPress={stopNavigation}
          >
            <Text className="text-white font-bold">×</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Draggable Pull-up Panel */}
      <DraggablePullUpPanel
        spots={filteredSpots}
        selectedIndex={selectedSpotIndex}
        onSpotSelect={handleSpotSelect}
        onScroll={handlePanelScroll}
      />

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
}
