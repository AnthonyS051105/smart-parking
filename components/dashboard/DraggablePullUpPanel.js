import React, { useRef, useEffect } from "react";
import {
  View,
  ScrollView,
  PanResponder,
  Animated,
  Dimensions,
} from "react-native";
import ParkingSpotCard from "./ParkingSpotCard";

const { height } = Dimensions.get("window");
const PANEL_MIN_HEIGHT = 180;
const PANEL_MAX_HEIGHT = height * 0.7;

const DraggablePullUpPanel = ({
  spots = [],
  selectedIndex = 0,
  onSpotSelect,
  onScroll,
  className = "",
}) => {
  const panelHeight = useRef(new Animated.Value(PANEL_MIN_HEIGHT)).current;
  const scrollViewRef = useRef(null);

  // Pan gesture handler for dragging
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dy) > 10;
      },

      onPanResponderGrant: () => {
        panelHeight.setOffset(panelHeight._value);
        panelHeight.setValue(0);
      },

      onPanResponderMove: (evt, gestureState) => {
        // Invert gesture (negative dy means swipe up)
        panelHeight.setValue(-gestureState.dy);
      },

      onPanResponderRelease: (evt, gestureState) => {
        panelHeight.flattenOffset();

        const currentHeight = panelHeight._value;
        let targetHeight;

        // Determine target height based on gesture velocity and current position
        if (
          gestureState.vy < -0.5 ||
          (gestureState.dy < -50 && currentHeight < PANEL_MAX_HEIGHT)
        ) {
          targetHeight = PANEL_MAX_HEIGHT; // Expand to full
        } else if (
          gestureState.vy > 0.5 ||
          (gestureState.dy > 50 && currentHeight > PANEL_MIN_HEIGHT)
        ) {
          targetHeight = PANEL_MIN_HEIGHT; // Collapse to minimum
        } else {
          // Stay at current state
          targetHeight =
            currentHeight > (PANEL_MIN_HEIGHT + PANEL_MAX_HEIGHT) / 2
              ? PANEL_MAX_HEIGHT
              : PANEL_MIN_HEIGHT;
        }

        Animated.spring(panelHeight, {
          toValue: targetHeight,
          useNativeDriver: false,
          tension: 100,
          friction: 8,
        }).start();
      },
    })
  ).current;

  // Auto-scroll to selected spot
  useEffect(() => {
    if (scrollViewRef.current && selectedIndex >= 0) {
      const cardHeight = 120; // Approximate card height
      const scrollOffset = selectedIndex * cardHeight;

      scrollViewRef.current.scrollTo({
        y: scrollOffset,
        animated: true,
      });
    }
  }, [selectedIndex]);

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const cardHeight = 120;
    const newIndex = Math.round(offsetY / cardHeight);

    if (
      newIndex !== selectedIndex &&
      newIndex >= 0 &&
      newIndex < spots.length &&
      onScroll
    ) {
      onScroll(newIndex);
    }
  };

  return (
    <Animated.View
      className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl ${className}`}
      style={{
        height: panelHeight,
        minHeight: PANEL_MIN_HEIGHT,
        maxHeight: PANEL_MAX_HEIGHT,
      }}
      {...panResponder.panHandlers}
    >
      {/* Handle Bar */}
      <View className="w-12 h-1 bg-gray-300 rounded-full self-center mt-3 mb-4" />

      {/* Content */}
      <View className="flex-1 px-5">
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          decelerationRate="fast"
          snapToInterval={120} // Snap to each card
        >
          {spots.map((spot, index) => (
            <ParkingSpotCard
              key={spot.id}
              spot={spot}
              isSelected={selectedIndex === index}
              onPress={() => onSpotSelect && onSpotSelect(index)}
              className="mb-2"
            />
          ))}

          {/* Bottom padding */}
          <View className="h-20" />
        </ScrollView>
      </View>
    </Animated.View>
  );
};

export default DraggablePullUpPanel;
