// Import Mapbox secara conditional
let Mapbox = null;
try {
  // Only try to require Mapbox if it's actually installed
  Mapbox = require("@rnmapbox/maps").default;
} catch (error) {
  console.warn("Mapbox not available - using React Native Maps fallback");
  Mapbox = null;
}

export const MAPBOX_CONFIG = {
  // Get free token from https://account.mapbox.com/access-tokens/
  ACCESS_TOKEN:
    "pk.eyJ1IjoiYW50aG9ueTA1IiwiYSI6ImNtZTQ3Y3F0MDAwMHEya29xMWUzcGVyNHcifQ.4CjdWQvtGe1YVYU-C8lR9Q", // Replace dengan token Anda
  STYLE_URL: "mapbox://styles/mapbox/streets-v12",
  DEFAULT_ZOOM: 13,
  NAVIGATION_ZOOM: 16,
  DEFAULT_CENTER: [106.816666, -6.2], // Jakarta [lng, lat]
};

// Set Mapbox token globally hanya jika tersedia
if (Mapbox && Mapbox.setAccessToken) {
  Mapbox.setAccessToken(MAPBOX_CONFIG.ACCESS_TOKEN);
}
