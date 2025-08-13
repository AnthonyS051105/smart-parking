import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { View, Text } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

const MapFallback = forwardRef(
  (
    {
      center = [106.816666, -6.2], // [lng, lat] format
      zoom = 13,
      markers = [],
      route = null,
      onMarkerPress,
      onMapMove,
      showUserLocation = true,
      followUser = false,
      className = "flex-1",
    },
    ref
  ) => {
    const mapRef = useRef(null);

    useImperativeHandle(ref, () => ({
      animateToLocation: (longitude, latitude, zoomLevel = 16) => {
        mapRef.current?.animateToRegion(
          {
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          1000
        );
      },

      fitToCoordinates: (coordinates) => {
        if (coordinates && coordinates.length > 0) {
          const coords = coordinates.map((coord) => ({
            latitude: coord[1],
            longitude: coord[0],
          }));
          mapRef.current?.fitToCoordinates(coords, {
            edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
            animated: true,
          });
        }
      },
    }));

    // Convert route coordinates for Polyline
    const routeCoordinates =
      route && route.coordinates
        ? route.coordinates.map((coord) => ({
            latitude: coord[1],
            longitude: coord[0],
          }))
        : [];

    return (
      <View className={className}>
        <MapView
          ref={mapRef}
          className="flex-1"
          style={{ flex: 1 }}
          initialRegion={{
            latitude: center[1], // lat from [lng, lat]
            longitude: center[0], // lng from [lng, lat]
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={showUserLocation}
          followsUserLocation={followUser}
          onRegionChangeComplete={onMapMove}
        >
          {/* Route Line */}
          {routeCoordinates.length > 0 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="#3B82F6"
              strokeWidth={6}
            />
          )}

          {/* Parking Spot Markers */}
          {markers.map((marker, index) => (
            <Marker
              key={marker.id}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              title={marker.name || `Spot ${marker.id}`}
              description={`${marker.available} available`}
              onPress={() => onMarkerPress && onMarkerPress(index, marker)}
              pinColor={
                marker.selected
                  ? "blue"
                  : marker.available > 0
                    ? "green"
                    : "red"
              }
            >
              {/* Custom marker view */}
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: marker.selected
                    ? "#3B82F6"
                    : marker.available > 0
                      ? "#10B981"
                      : "#EF4444",
                  borderWidth: 2,
                  borderColor: "white",
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 12,
                    fontWeight: "bold",
                  }}
                >
                  {marker.available}
                </Text>
              </View>
            </Marker>
          ))}
        </MapView>
      </View>
    );
  }
);

MapFallback.displayName = "MapFallback";
export default MapFallback;
