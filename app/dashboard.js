import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { View, StatusBar, Alert, Text, TouchableOpacity, Platform, Image } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "../hooks/useLocation";
import { useNavigation } from "../hooks/useNavigation";

// Import Mapbox map component
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
  const [waypoints, setWaypoints] = useState(null);

  const {
    isNavigating,
    route,
    instructions,
    currentStep,
    navigationState,
    voiceEnabled,
    trafficInfo,
    startNavigation,
    stopNavigation,
    updateNavigationProgress,
    toggleVoice,
    getCurrentInstruction,
    getNextInstruction,
    getEstimatedArrival,
    formatDuration,
    formatDistance,
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
      if (mapRef.current?.animateToLocation) {
        mapRef.current.animateToLocation(
          selectedSpot.longitude,
          selectedSpot.latitude,
          MAPBOX_CONFIG.NAVIGATION_ZOOM
        );
      }
    },
    [filteredSpots]
  );

  // Handle marker press on map
  const handleMarkerPress = useCallback(
    (index, markerData) => {
      if (index !== null && index !== undefined) {
        handleSpotSelect(index);
      }
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
    if (userLocation && mapRef.current?.animateToLocation) {
      mapRef.current.animateToLocation(
        userLocation.longitude,
        userLocation.latitude,
        MAPBOX_CONFIG.LOCATION_ZOOM
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
  const handleStartNavigation = useCallback(async () => {
    if (userLocation && filteredSpots[selectedSpotIndex]) {
      const destination = {
        latitude: filteredSpots[selectedSpotIndex].latitude,
        longitude: filteredSpots[selectedSpotIndex].longitude,
      };

      try {
        // Set waypoints for the map
        setWaypoints([
          { lat: userLocation.latitude, lng: userLocation.longitude },
          { lat: destination.latitude, lng: destination.longitude }
        ]);

        await startNavigation(userLocation, destination, {
          optimize: true,
          prioritizeTime: true
        });
      } catch (error) {
        Alert.alert("Navigation Error", "Failed to start navigation. Please try again.");
        console.error("Navigation error:", error);
      }
    }
  }, [userLocation, filteredSpots, selectedSpotIndex, startNavigation]);

  // Handle route found from map
  const handleRouteFound = useCallback((foundRoute) => {
    // Route found from Mapbox routing
    console.log("Route found:", foundRoute);
  }, []);

  // Handle instructions change from map
  const handleInstructionsChange = useCallback((mapInstructions) => {
    // Instructions from Mapbox routing
    console.log("Instructions updated:", mapInstructions);
  }, []);

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

  // Update navigation progress when user location changes
  useEffect(() => {
    if (isNavigating && userLocation) {
      updateNavigationProgress(userLocation);
    }
  }, [isNavigating, userLocation, updateNavigationProgress]);

  // Get current instruction for display
  const currentInstruction = getCurrentInstruction();
  const estimatedArrival = getEstimatedArrival();

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
            ? [userLocation.longitude, userLocation.latitude] // Mapbox format [lng, lat]
            : MAPBOX_CONFIG.DEFAULT_CENTER
        }
        zoom={MAPBOX_CONFIG.DEFAULT_ZOOM}
        markers={mapMarkers}
        route={route}
        waypoints={waypoints}
        onMarkerPress={handleMarkerPress}
        onRouteFound={handleRouteFound}
        onInstructionsChange={handleInstructionsChange}
        followUser={isNavigating}
        showUserLocation={true}
        navigationMode={isNavigating}
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
      {isNavigating && currentInstruction && (
        <View className="absolute top-32 left-4 right-4 z-30">
          <View className="bg-white rounded-xl shadow-lg border border-gray-100">
            {/* Navigation Header */}
            <View className="bg-blue-600 rounded-t-xl p-4 flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-white text-lg font-bold">
                  {currentInstruction.instruction}
                </Text>
                <Text className="text-blue-100 text-sm">
                  In {formatDistance(currentInstruction.distance)}
                </Text>
              </View>
              
              {/* Voice toggle and stop buttons */}
              <View className="flex-row space-x-2">
                <TouchableOpacity
                  className={`w-10 h-10 rounded-full items-center justify-center ${
                    voiceEnabled ? 'bg-white/20' : 'bg-red-500/30'
                  }`}
                  onPress={toggleVoice}
                >
                  <Text className="text-white text-xs">🔊</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
                  onPress={stopNavigation}
                >
                  <Text className="text-white font-bold text-lg">×</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Navigation Info */}
            {estimatedArrival && (
              <View className="p-4 bg-gray-50 rounded-b-xl">
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="text-gray-600 text-sm">Estimated Arrival</Text>
                    <Text className="text-gray-900 font-semibold">
                      {estimatedArrival.estimatedArrival.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  </View>
                  
                  <View>
                    <Text className="text-gray-600 text-sm">Remaining</Text>
                    <Text className="text-gray-900 font-semibold">
                      {formatDuration(estimatedArrival.remainingTime)}
                    </Text>
                  </View>
                  
                  <View>
                    <Text className="text-gray-600 text-sm">Distance</Text>
                    <Text className="text-gray-900 font-semibold">
                      {formatDistance(estimatedArrival.remainingDistance)}
                    </Text>
                  </View>
                </View>

                {/* Traffic info */}
                {trafficInfo && trafficInfo.condition !== 'light' && trafficInfo.condition !== 'unknown' && (
                  <View className="mt-3 p-2 bg-yellow-100 rounded-lg">
                    <Text className="text-yellow-800 text-sm">
                      🚦 {trafficInfo.condition.charAt(0).toUpperCase() + trafficInfo.condition.slice(1)} traffic
                      {trafficInfo.delayMinutes > 0 && ` - +${trafficInfo.delayMinutes} min delay`}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      )}

      {/* Draggable Pull-up Panel */}
      <DraggablePullUpPanel
        spots={filteredSpots}
        selectedIndex={selectedSpotIndex}
        onSpotSelect={handleSpotSelect}
        onScroll={handlePanelScroll}
        onStartNavigation={handleStartNavigation}
        isNavigating={isNavigating}
        navigationState={navigationState}
      />

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
}
