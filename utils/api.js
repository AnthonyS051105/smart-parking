// API Configuration for SmartParking Backend

// ✅ Multiple IP addresses to try (in priority order)
const POSSIBLE_BASE_URLS = [
  "http://10.242.151.149:5000/api", // Primary network interface
  "http://localhost:5000/api", // Local fallback
  "http://127.0.0.1:5000/api", // Loopback fallback
  "http://192.168.122.1:5000/api", // Virtual interface
];

const API_CONFIG = {
  // Base URL configuration
  BASE_URL: __DEV__
    ? process.env.EXPO_PUBLIC_API_URL || POSSIBLE_BASE_URLS[0] // Use primary IP
    : "https://your-production-api.com/api", // Production

  // API Endpoints - sesuai dengan backend Flask
  ENDPOINTS: {
    LOGIN: "/auth/login", // POST /api/auth/login
    SIGNUP: "/auth/signup", // POST /api/auth/signup
    GOOGLE_LOGIN: "/auth/google", // POST /api/auth/google
    VERIFY_TOKEN: "/auth/verify", // POST /api/auth/verify
    PROFILE: "/auth/profile", // GET /api/auth/profile
    UPDATE_PROFILE: "/auth/profile", // PUT /api/auth/profile (future)
  },

  // All possible URLs for testing
  FALLBACK_URLS: POSSIBLE_BASE_URLS,

  // Request configuration
  TIMEOUT: 10000, // 10 seconds

  // Headers
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

// Helper function untuk mendapatkan full URL
export const getApiUrl = (endpoint) => {
  const fullUrl = `${API_CONFIG.BASE_URL}${endpoint}`;
  console.log(`🔗 API URL: ${fullUrl}`); // Debug log
  return fullUrl;
};

// ✅ NEW: Function to test connectivity to all possible URLs
export const testConnectivity = async () => {
  console.log("🔍 Testing connectivity to all possible backend URLs...");

  for (let i = 0; i < POSSIBLE_BASE_URLS.length; i++) {
    const baseUrl = POSSIBLE_BASE_URLS[i];
    const healthUrl = baseUrl.replace("/api", "/health");

    try {
      console.log(`🧪 Testing: ${healthUrl}`);

      const response = await fetch(healthUrl, {
        method: "GET",
        timeout: 5000,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ SUCCESS: ${baseUrl} is accessible!`);
        console.log(`📊 Health data:`, data);
        return baseUrl;
      }
    } catch (error) {
      console.log(`❌ FAILED: ${baseUrl} - ${error.message}`);
    }
  }

  console.log("❌ No backend URL is accessible!");
  return null;
};

// Helper function untuk development debugging
export const getApiInfo = () => {
  console.log("📡 API Configuration:");
  console.log("Base URL:", API_CONFIG.BASE_URL);
  console.log("Fallback URLs:", API_CONFIG.FALLBACK_URLS);
  console.log("Endpoints:", API_CONFIG.ENDPOINTS);
  console.log("Environment:", __DEV__ ? "Development" : "Production");
};

export default API_CONFIG;
