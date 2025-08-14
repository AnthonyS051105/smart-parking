import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from "react";
import { View, Platform, Text } from "react-native";

// Only import Leaflet components for web platform
let MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents = null;
let L = null;
let RoutingMachine = null;

if (Platform.OS === 'web') {
  try {
    const leaflet = require('leaflet');
    const reactLeaflet = require('react-leaflet');
    const routingMachine = require('leaflet-routing-machine');
    
    L = leaflet;
    MapContainer = reactLeaflet.MapContainer;
    TileLayer = reactLeaflet.TileLayer;
    Marker = reactLeaflet.Marker;
    Popup = reactLeaflet.Popup;
    useMap = reactLeaflet.useMap;
    useMapEvents = reactLeaflet.useMapEvents;
    RoutingMachine = routingMachine;

    // Configure Leaflet icons
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  } catch (error) {
    console.warn('Leaflet not available for web platform:', error);
  }
}

// Custom routing control component
const RoutingControl = ({ waypoints, onRouteFound, onInstructionsChange }) => {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!L || !RoutingMachine || !waypoints || waypoints.length < 2) return;

    // Remove existing routing control
    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

    // Create new routing control
    routingControlRef.current = L.Routing.control({
      waypoints: waypoints.map(point => L.latLng(point.lat, point.lng)),
      routeWhileDragging: false,
      lineOptions: {
        styles: [{ color: '#3B82F6', weight: 6, opacity: 0.8 }]
      },
      show: false,
      addWaypoints: false,
      createMarker: () => null, // Hide default markers
    })
    .on('routesfound', (e) => {
      const routes = e.routes;
      const route = routes[0];
      if (route && onRouteFound) {
        onRouteFound(route);
      }
      if (route && onInstructionsChange) {
        onInstructionsChange(route.instructions);
      }
    })
    .addTo(map);

    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }
    };
  }, [map, waypoints, onRouteFound, onInstructionsChange]);

  return null;
};

// Map events handler
const MapEvents = ({ onMapMove, onMarkerPress }) => {
  useMapEvents({
    moveend: (e) => {
      if (onMapMove) {
        const center = e.target.getCenter();
        onMapMove({ latitude: center.lat, longitude: center.lng });
      }
    },
    click: (e) => {
      if (onMarkerPress) {
        onMarkerPress(null, { latitude: e.latlng.lat, longitude: e.latlng.lng });
      }
    },
  });
  return null;
};

// Custom marker icons
const createCustomIcon = (available, selected) => {
  if (!L) return null;

  const color = selected ? '#3B82F6' : available > 0 ? '#10B981' : '#EF4444';
  
  return L.divIcon({
    html: `
      <div style="
        width: 32px;
        height: 32px;
        border-radius: 16px;
        background-color: ${color};
        border: 2px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        transform: ${selected ? 'scale(1.1)' : 'scale(1)'};
      ">
        <span style="color: white; font-weight: bold; font-size: 12px;">
          ${available}
        </span>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const LeafletMap = forwardRef(
  (
    {
      center = [-6.2, 106.816666], // [lat, lng] format for Leaflet
      zoom = 13,
      markers = [],
      route = null,
      waypoints = null,
      onMarkerPress,
      onMapMove,
      onRouteFound,
      onInstructionsChange,
      showUserLocation = true,
      followUser = false,
      className = "flex-1",
    },
    ref
  ) => {
    const mapRef = useRef(null);
    const [userLocation, setUserLocation] = useState(null);

    useImperativeHandle(ref, () => ({
      animateToLocation: (longitude, latitude, zoomLevel = 16) => {
        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], zoomLevel);
        }
      },

      fitToCoordinates: (coordinates) => {
        if (mapRef.current && coordinates && coordinates.length > 0) {
          const bounds = coordinates.map(coord => [coord[1], coord[0]]); // Convert [lng, lat] to [lat, lng]
          mapRef.current.fitBounds(bounds, { padding: [20, 20] });
        }
      },

      getMap: () => mapRef.current,
    }));

    // Get user location
    useEffect(() => {
      if (showUserLocation && Platform.OS === 'web' && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => console.warn('Error getting location:', error),
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      }
    }, [showUserLocation]);

    // Fallback for non-web platforms
    if (Platform.OS !== 'web' || !MapContainer) {
      return (
        <View className={className}>
          <View className="flex-1 bg-gray-200 items-center justify-center">
            <Text className="text-gray-600 text-lg">
              Leaflet Map (Web Only)
            </Text>
            <Text className="text-gray-500 text-sm mt-2">
              Use web browser to view interactive map
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View className={className}>
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
          zoomControl={true}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Map Events */}
          <MapEvents onMapMove={onMapMove} onMarkerPress={onMarkerPress} />
          
          {/* Routing Control */}
          {waypoints && waypoints.length >= 2 && (
            <RoutingControl
              waypoints={waypoints}
              onRouteFound={onRouteFound}
              onInstructionsChange={onInstructionsChange}
            />
          )}
          
          {/* User Location Marker */}
          {userLocation && showUserLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]}>
              <Popup>Your Location</Popup>
            </Marker>
          )}
          
          {/* Parking Spot Markers */}
          {markers.map((marker, index) => (
            <Marker
              key={marker.id}
              position={[marker.latitude, marker.longitude]}
              icon={createCustomIcon(marker.available, marker.selected)}
              eventHandlers={{
                click: () => onMarkerPress && onMarkerPress(index, marker),
              }}
            >
              <Popup>
                <div>
                  <h3>{marker.name || `Parking Spot ${marker.id}`}</h3>
                  <p>{marker.available} spaces available</p>
                  <p>Rate: ${marker.hourlyRate}/hour</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </View>
    );
  }
);

LeafletMap.displayName = "LeafletMap";
export default LeafletMap;