import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  PanGestureHandler,
  Animated,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import ParkingSpotCard from "./ParkingSpotCard";

const { height: screenHeight } = Dimensions.get("window");
const PANEL_HEIGHT = screenHeight * 0.6; // 60% of screen height
const COLLAPSED_HEIGHT = 120; // Height when collapsed
const SNAP_POINTS = [COLLAPSED_HEIGHT, PANEL_HEIGHT * 0.5, PANEL_HEIGHT]; // Collapsed, Half, Full

export default function DraggablePullUpPanel({
  spots = [],
  selectedIndex = 0,
  onSpotSelect,
  onScroll,
  onStartNavigation,
  isNavigating = false,
  navigationState = "idle",
}) {
  const [panelHeight, setPanelHeight] = useState(COLLAPSED_HEIGHT);
  const [currentSnapPoint, setCurrentSnapPoint] = useState(0);
  const scrollViewRef = useRef(null);
  const panelPosition = useRef(new Animated.Value(COLLAPSED_HEIGHT)).current;
  const lastPanelHeight = useRef(COLLAPSED_HEIGHT);

  // Auto-scroll to selected item when selectedIndex changes
  useEffect(() => {
    if (scrollViewRef.current && selectedIndex >= 0) {
      const cardHeight = 100; // Approximate height of each card
      const scrollOffset = selectedIndex * cardHeight;

      scrollViewRef.current.scrollTo({
        y: scrollOffset,
        animated: true,
      });
    }
  }, [selectedIndex]);

  // Update panel height when animation value changes
  useEffect(() => {
    const listener = panelPosition.addListener(({ value }) => {
      setPanelHeight(value);
    });

    return () => {
      panelPosition.removeListener(listener);
    };
  }, [panelPosition]);

  // Snap to nearest snap point
  const snapToPoint = useCallback(
    (targetHeight) => {
      // Find closest snap point
      let closestSnapPoint = 0;
      let minDistance = Math.abs(targetHeight - SNAP_POINTS[0]);

      SNAP_POINTS.forEach((point, index) => {
        const distance = Math.abs(targetHeight - point);
        if (distance < minDistance) {
          minDistance = distance;
          closestSnapPoint = index;
        }
      });

      const targetSnapHeight = SNAP_POINTS[closestSnapPoint];
      setCurrentSnapPoint(closestSnapPoint);

      Animated.spring(panelPosition, {
        toValue: targetSnapHeight,
        useNativeDriver: false,
        tension: 100,
        friction: 8,
      }).start();

      lastPanelHeight.current = targetSnapHeight;
    },
    [panelPosition]
  );

  // Pan gesture handler
  const panGesture = Gesture.Pan()
    .onStart(() => {
      lastPanelHeight.current = panelHeight;
    })
    .onUpdate((event) => {
      const newHeight = Math.max(
        COLLAPSED_HEIGHT,
        Math.min(PANEL_HEIGHT, lastPanelHeight.current - event.translationY)
      );
      panelPosition.setValue(newHeight);
    })
    .onEnd((event) => {
      const velocityY = event.velocityY;
      const currentHeight = panelHeight;

      // If moving fast, snap to next point in direction of movement
      if (Math.abs(velocityY) > 500) {
        if (velocityY < 0) {
          // Moving up (expanding)
          const nextPoint = Math.min(
            currentSnapPoint + 1,
            SNAP_POINTS.length - 1
          );
          snapToPoint(SNAP_POINTS[nextPoint]);
        } else {
          // Moving down (collapsing)
          const nextPoint = Math.max(currentSnapPoint - 1, 0);
          snapToPoint(SNAP_POINTS[nextPoint]);
        }
      } else {
        // Snap to nearest point
        snapToPoint(currentHeight);
      }
    });

  // Handle spot selection and notify parent
  const handleSpotPress = useCallback(
    (index, spot) => {
      onSpotSelect?.(index);

      // Also trigger onScroll to update map
      if (onScroll) {
        onScroll(index);
      }
    },
    [onSpotSelect, onScroll]
  );

  // Handle scroll events to sync with map
  const handleScroll = useCallback(
    (event) => {
      if (!onScroll || spots.length === 0) return;

      const cardHeight = 100; // Approximate height of each card
      const scrollY = event.nativeEvent.contentOffset.y;
      const index = Math.round(scrollY / cardHeight);
      const clampedIndex = Math.max(0, Math.min(index, spots.length - 1));

      // Only trigger if index actually changed
      if (clampedIndex !== selectedIndex) {
        onScroll(clampedIndex);
      }
    },
    [onScroll, spots.length, selectedIndex]
  );

  // Render panel header
  const renderHeader = () => (
    <View className="bg-white rounded-t-3xl shadow-lg">
      {/* Drag Handle */}
      <View className="items-center py-3">
        <View className="w-12 h-1 bg-gray-300 rounded-full" />
      </View>

      {/* Panel Title */}
      <View className="px-6 pb-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-xl font-bold text-gray-900">
              Parking Spots
            </Text>
            <Text className="text-sm text-gray-500">
              {spots.length} locations found
            </Text>
          </View>

          {/* Navigation Status */}
          {isNavigating && (
            <View className="bg-blue-100 px-3 py-1 rounded-full">
              <Text className="text-blue-600 text-sm font-medium">
                {navigationState === "calculating"
                  ? "Calculating..."
                  : "Navigating"}
              </Text>
            </View>
          )}
        </View>

        {/* Filter/Sort Options */}
        <View className="flex-row mt-3 space-x-2">
          <View className="bg-gray-100 px-3 py-2 rounded-full flex-1">
            <Text className="text-gray-600 text-sm text-center">
              Nearest First
            </Text>
          </View>
          <View className="bg-gray-100 px-3 py-2 rounded-full flex-1">
            <Text className="text-gray-600 text-sm text-center">Available</Text>
          </View>
        </View>
      </View>
    </View>
  );

  // Render empty state
  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center py-12">
      <Text className="text-gray-400 text-lg">🅿️</Text>
      <Text className="text-gray-500 text-base mt-2">
        No parking spots found
      </Text>
      <Text className="text-gray-400 text-sm mt-1">
        Try adjusting your search or location
      </Text>
    </View>
  );

  return (
    <Animated.View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: panelPosition,
        zIndex: 20,
      }}
      className="bg-transparent"
    >
      <GestureDetector gesture={panGesture}>
        <View className="flex-1">
          {renderHeader()}

          {/* Content Area */}
          <View className="flex-1 bg-white">
            {spots.length === 0 ? (
              renderEmptyState()
            ) : (
              <ScrollView
                ref={scrollViewRef}
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: 16,
                  paddingBottom: 100, // Extra space at bottom
                }}
                onScroll={handleScroll}
                scrollEventThrottle={100}
                decelerationRate="fast"
                snapToInterval={100} // Snap to each card
                snapToAlignment="start"
              >
                {spots.map((spot, index) => (
                  <View key={spot.id} style={{ marginBottom: 12 }}>
                    <ParkingSpotCard
                      spot={spot}
                      isSelected={index === selectedIndex}
                      onPress={() => handleSpotPress(index, spot)}
                      onStartNavigation={() => onStartNavigation?.(index, spot)}
                      isNavigating={isNavigating}
                      navigationState={navigationState}
                      showNavigationButton={index === selectedIndex}
                    />
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </GestureDetector>
    </Animated.View>
  );
}
