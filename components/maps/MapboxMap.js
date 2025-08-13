import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { View, Text, Platform } from "react-native";

// Dynamic import untuk menangani Mapbox error di Expo Go
let Mapbox = null;
let MapFallback = null;

try {
  // Try to import Mapbox (akan berhasil di development build)
  Mapbox = require("@rnmapbox/maps").default;
} catch (error) {
  // Fallback ke react-native-maps jika Mapbox tidak tersedia
  console.warn("Mapbox not available, using fallback map");
  MapFallback = require("./MapFallback").default;
}

import { MAPBOX_CONFIG } from "../../utils/mapboxConfig";

const MapboxMap = forwardRef(
  (
    {
      center = MAPBOX_CONFIG.DEFAULT_CENTER,
      zoom = MAPBOX_CONFIG.DEFAULT_ZOOM,
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
    const cameraRef = useRef(null);

    useImperativeHandle(ref, () => ({
      animateToLocation: (
        longitude,
        latitude,
        zoomLevel = MAPBOX_CONFIG.NAVIGATION_ZOOM
      ) => {
        cameraRef.current?.setCamera({
          centerCoordinate: [longitude, latitude],
          zoomLevel: zoomLevel,
          animationDuration: 1000,
        });
      },

      fitToCoordinates: (coordinates) => {
        if (coordinates && coordinates.length > 0) {
          const bounds = coordinates.reduce(
            (acc, coord) => {
              acc.ne = [
                Math.max(acc.ne[0], coord[0]),
                Math.max(acc.ne[1], coord[1]),
              ];
              acc.sw = [
                Math.min(acc.sw[0], coord[0]),
                Math.min(acc.sw[1], coord[1]),
              ];
              return acc;
            },
            {
              ne: [coordinates[0][0], coordinates[0][1]],
              sw: [coordinates[0][0], coordinates[0][1]],
            }
          );

          cameraRef.current?.fitBounds(bounds.ne, bounds.sw, 100, 1000);
        }
      },
    }));

    // Use fallback map if Mapbox is not available
    if (!Mapbox && MapFallback) {
      return (
        <MapFallback
          center={center}
          zoom={zoom}
          markers={markers}
          route={route}
          onMarkerPress={onMarkerPress}
          onMapMove={onMapMove}
          showUserLocation={showUserLocation}
          followUser={followUser}
          className={className}
          ref={ref}
        />
      );
    }

    return (
      <View className={className}>
        <Mapbox.MapView
          ref={mapRef}
          className="flex-1"
          styleURL={MAPBOX_CONFIG.STYLE_URL}
          onRegionDidChange={onMapMove}
        >
          <Mapbox.Camera
            ref={cameraRef}
            centerCoordinate={center}
            zoomLevel={zoom}
            followUserLocation={followUser}
          />

          {/* User Location */}
          {showUserLocation && (
            <Mapbox.UserLocation
              visible={true}
              showsUserHeadingIndicator={true}
              androidRenderMode="gps"
            />
          )}

          {/* Navigation Route */}
          {route && (
            <Mapbox.ShapeSource id="route" shape={route}>
              <Mapbox.LineLayer
                id="routeLine"
                style={{
                  lineColor: "#3B82F6",
                  lineWidth: 6,
                  lineCap: "round",
                  lineJoin: "round",
                  lineOpacity: 0.8,
                }}
              />
            </Mapbox.ShapeSource>
          )}

          {/* Parking Spot Markers */}
          {markers.map((marker, index) => (
            <Mapbox.PointAnnotation
              key={marker.id}
              id={`marker-${marker.id}`}
              coordinate={[marker.longitude, marker.latitude]}
              onSelected={() => onMarkerPress && onMarkerPress(index, marker)}
            >
              <View
                className={`w-8 h-8 rounded-full border-2 border-white shadow-lg ${
                  marker.selected
                    ? "bg-blue-600 scale-110"
                    : marker.available > 0
                      ? "bg-green-500"
                      : "bg-red-500"
                }`}
              >
                <View className="flex-1 items-center justify-center">
                  <Text className="text-white text-xs font-bold">
                    {marker.available}
                  </Text>
                </View>
              </View>
            </Mapbox.PointAnnotation>
          ))}
        </Mapbox.MapView>
      </View>
    );
  }
);

MapboxMap.displayName = "MapboxMap";
export default MapboxMap;
