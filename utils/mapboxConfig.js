import Mapbox from "@rnmapbox/maps";

// Mapbox configuration
export const MAPBOX_CONFIG = {
  // Get free token from https://account.mapbox.com/access-tokens/
  ACCESS_TOKEN:
    "pk.eyJ1IjoiYW50aG9ueTA1IiwiYSI6ImNtZTQ3Y3F0MDAwMHEya29xMWUzcGVyNHcifQ.4CjdWQvtGe1YVYU-C8lR9Q",

  // Map styles
  STYLE_URL: "mapbox://styles/mapbox/streets-v12",
  NAVIGATION_STYLE_URL: "mapbox://styles/mapbox/navigation-day-v1",
  SATELLITE_STYLE_URL: "mapbox://styles/mapbox/satellite-streets-v12",

  // Zoom levels
  DEFAULT_ZOOM: 13,
  NAVIGATION_ZOOM: 16,
  LOCATION_ZOOM: 15,

  // Default center (Jakarta)
  DEFAULT_CENTER: [106.816666, -6.2], // [lng, lat]

  // Animation settings
  ANIMATION_DURATION: 1000,

  // Clustering settings
  CLUSTER_RADIUS: 50,
  CLUSTER_MAX_ZOOM: 14,
};

// Initialize Mapbox
if (Mapbox && Mapbox.setAccessToken) {
  Mapbox.setAccessToken(MAPBOX_CONFIG.ACCESS_TOKEN);
}

// Export Mapbox instance
export default Mapbox;
