import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from "react";
import { View, Text, Alert } from "react-native";
import Mapbox, { MAPBOX_CONFIG } from "../../utils/mapboxConfig";
import supercluster from "supercluster";

const MapboxMap = forwardRef(
  (
    {
      center = MAPBOX_CONFIG.DEFAULT_CENTER,
      zoom = MAPBOX_CONFIG.DEFAULT_ZOOM,
      markers = [],
      route = null,
      waypoints = null,
      onMarkerPress,
      onMapMove,
      onRouteFound,
      onInstructionsChange,
      showUserLocation = true,
      followUser = false,
      navigationMode = false,
      className = "flex-1",
    },
    ref
  ) => {
    const mapRef = useRef(null);
    const cameraRef = useRef(null);
    const [isMapReady, setIsMapReady] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [clusteredMarkers, setClusteredMarkers] = useState([]);

    // Cluster configuration
    const cluster = useRef(
      new supercluster({
        radius: MAPBOX_CONFIG.CLUSTER_RADIUS,
        maxZoom: MAPBOX_CONFIG.CLUSTER_MAX_ZOOM,
      })
    );

    // Imperative handle for parent component control
    useImperativeHandle(ref, () => ({
      animateToLocation: (longitude, latitude, zoomLevel = MAPBOX_CONFIG.NAVIGATION_ZOOM) => {
        if (cameraRef.current) {
          cameraRef.current.setCamera({
            centerCoordinate: [longitude, latitude],
            zoomLevel: zoomLevel,
            animationDuration: MAPBOX_CONFIG.ANIMATION_DURATION,
          });
        }
      },

      fitToCoordinates: (coordinates, padding = [50, 50, 50, 50]) => {
        if (cameraRef.current && coordinates && coordinates.length > 0) {
          cameraRef.current.fitBounds(
            coordinates[0],
            coordinates[coordinates.length - 1],
            padding,
            MAPBOX_CONFIG.ANIMATION_DURATION
          );
        }
      },

      getMap: () => mapRef.current,

      setCamera: (options) => {
        if (cameraRef.current) {
          cameraRef.current.setCamera({
            animationDuration: MAPBOX_CONFIG.ANIMATION_DURATION,
            ...options,
          });
        }
      },

      flyTo: (coordinates, zoomLevel = MAPBOX_CONFIG.DEFAULT_ZOOM) => {
        if (cameraRef.current) {
          cameraRef.current.flyTo(coordinates, MAPBOX_CONFIG.ANIMATION_DURATION);
          if (zoomLevel) {
            setTimeout(() => {
              cameraRef.current.zoomTo(zoomLevel, MAPBOX_CONFIG.ANIMATION_DURATION);
            }, 100);
          }
        }
      },
    }));

    // Process markers for clustering
    useEffect(() => {
      if (markers.length > 0) {
        const points = markers.map((marker, index) => ({
          type: "Feature",
          properties: {
            cluster: false,
            markerId: marker.id,
            markerIndex: index,
            ...marker,
          },
          geometry: {
            type: "Point",
            coordinates: [marker.longitude, marker.latitude],
          },
        }));

        cluster.current.load(points);
        updateClusters();
      }
    }, [markers]);

    // Update clusters based on current zoom
    const updateClusters = (zoomLevel = MAPBOX_CONFIG.DEFAULT_ZOOM) => {
      const bbox = [-180, -85, 180, 85]; // World bounds
      const clusters = cluster.current.getClusters(bbox, Math.floor(zoomLevel));
      setClusteredMarkers(clusters);
    };

    // Handle map ready
    const handleMapReady = () => {
      setIsMapReady(true);
    };

    // Handle region change
    const handleRegionDidChange = async () => {
      if (mapRef.current) {
        try {
          const zoom = await mapRef.current.getZoom();
          const center = await mapRef.current.getCenter();
          
          updateClusters(zoom);
          
          if (onMapMove) {
            onMapMove({
              latitude: center[1],
              longitude: center[0],
              zoom: zoom,
            });
          }
        } catch (error) {
          console.warn("Error getting map state:", error);
        }
      }
    };

    // Handle user location update
    const handleUserLocationUpdate = (location) => {
      setUserLocation(location.coords);
    };

    // Handle marker press
    const handleMarkerPress = (marker) => {
      if (marker.properties.cluster) {
        // Handle cluster press - zoom in
        const clusterId = marker.properties.cluster_id;
        const expansionZoom = cluster.current.getClusterExpansionZoom(clusterId);
        
        if (cameraRef.current) {
          cameraRef.current.setCamera({
            centerCoordinate: marker.geometry.coordinates,
            zoomLevel: expansionZoom,
            animationDuration: MAPBOX_CONFIG.ANIMATION_DURATION,
          });
        }
      } else {
        // Handle individual marker press
        if (onMarkerPress) {
          onMarkerPress(marker.properties.markerIndex, marker.properties);
        }
      }
    };

    // Render marker annotation
    const renderMarker = (marker, index) => {
      const isCluster = marker.properties.cluster;
      const coordinates = marker.geometry.coordinates;

      if (isCluster) {
        // Render cluster marker
        const pointCount = marker.properties.point_count;
        return (
          <Mapbox.PointAnnotation
            key={`cluster-${marker.properties.cluster_id}`}
            id={`cluster-${marker.properties.cluster_id}`}
            coordinate={coordinates}
            onSelected={() => handleMarkerPress(marker)}
          >
            <View className="w-12 h-12 rounded-full bg-blue-600 border-2 border-white shadow-lg items-center justify-center">
              <Text className="text-white font-bold text-sm">{pointCount}</Text>
            </View>
          </Mapbox.PointAnnotation>
        );
      } else {
        // Render individual marker
        const markerData = marker.properties;
        const isSelected = markerData.selected;
        const available = markerData.available || 0;

        return (
          <Mapbox.PointAnnotation
            key={`marker-${markerData.markerId}`}
            id={`marker-${markerData.markerId}`}
            coordinate={coordinates}
            onSelected={() => handleMarkerPress(marker)}
          >
            <View
              className={`w-10 h-10 rounded-full border-2 border-white shadow-lg items-center justify-center ${
                isSelected
                  ? "bg-blue-600 scale-110"
                  : available > 0
                    ? "bg-green-500"
                    : "bg-red-500"
              }`}
            >
              <Text className="text-white text-xs font-bold">
                {available}
              </Text>
            </View>
          </Mapbox.PointAnnotation>
        );
      }
    };

    // Render route
    const renderRoute = () => {
      if (!route || !route.coordinates) return null;

      return (
        <Mapbox.ShapeSource id="route" shape={{
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: route.coordinates,
          },
        }}>
          <Mapbox.LineLayer
            id="routeLine"
            style={{
              lineColor: navigationMode ? "#FF6B35" : "#3B82F6",
              lineWidth: navigationMode ? 8 : 6,
              lineCap: "round",
              lineJoin: "round",
              lineOpacity: 0.9,
            }}
          />
        </Mapbox.ShapeSource>
      );
    };

    // Error boundary for Mapbox
    if (!Mapbox) {
      return (
        <View className={className}>
          <View className="flex-1 bg-gray-200 items-center justify-center">
            <Text className="text-gray-600 text-lg font-bold">
              Mapbox Not Available
            </Text>
            <Text className="text-gray-500 text-sm mt-2 text-center px-4">
              Please build the app for development to use Mapbox maps
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View className={className}>
        <Mapbox.MapView
          ref={mapRef}
          style={{ flex: 1 }}
          styleURL={
            navigationMode 
              ? MAPBOX_CONFIG.NAVIGATION_STYLE_URL 
              : MAPBOX_CONFIG.STYLE_URL
          }
          onDidFinishLoadingMap={handleMapReady}
          onRegionDidChange={handleRegionDidChange}
          logoEnabled={false}
          attributionEnabled={false}
          scaleBarEnabled={false}
          compassEnabled={true}
          rotateEnabled={!navigationMode}
          pitchEnabled={!navigationMode}
        >
          {/* Camera */}
          <Mapbox.Camera
            ref={cameraRef}
            centerCoordinate={center}
            zoomLevel={zoom}
            followUserLocation={followUser}
            followUserMode={followUser ? "compass" : "none"}
            animationDuration={MAPBOX_CONFIG.ANIMATION_DURATION}
          />

          {/* User Location */}
          {showUserLocation && (
            <Mapbox.UserLocation
              visible={true}
              showsUserHeadingIndicator={true}
              minDisplacement={1}
              onUpdate={handleUserLocationUpdate}
            />
          )}

          {/* Route */}
          {renderRoute()}

          {/* Markers */}
          {isMapReady && clusteredMarkers.map((marker, index) => 
            renderMarker(marker, index)
          )}

          {/* Waypoints for navigation */}
          {waypoints && waypoints.map((waypoint, index) => (
            <Mapbox.PointAnnotation
              key={`waypoint-${index}`}
              id={`waypoint-${index}`}
              coordinate={[waypoint.lng, waypoint.lat]}
            >
              <View
                className={`w-6 h-6 rounded-full border-2 border-white shadow-lg ${
                  index === 0 ? "bg-green-600" : "bg-red-600"
                }`}
              >
                <View className="flex-1 items-center justify-center">
                  <Text className="text-white text-xs font-bold">
                    {index === 0 ? "S" : "E"}
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
