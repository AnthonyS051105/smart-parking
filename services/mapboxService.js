Coding / SmartParking / services / mapboxService.js;
import { MAPBOX_CONFIG } from "../utils/mapboxConfig";

export const mapboxDirectionsService = {
  async getDirections(origin, destination) {
    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/` +
          `${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}` +
          `?access_token=${MAPBOX_CONFIG.ACCESS_TOKEN}&` +
          `geometries=geojson&steps=true&voice_instructions=true&` +
          `annotations=duration,distance,speed`
      );

      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        return {
          geometry: route.geometry,
          steps: route.legs[0].steps,
          duration: route.duration, // seconds
          distance: route.distance, // meters
        };
      }

      throw new Error("No route found");
    } catch (error) {
      console.error("Directions API error:", error);
      throw error;
    }
  },

  async getTrafficData(coordinates) {
    // Simple traffic simulation - replace with real traffic API
    return {
      congestionLevel: Math.random() > 0.5 ? "moderate" : "light",
      alternateRoute: null,
    };
  },
};
