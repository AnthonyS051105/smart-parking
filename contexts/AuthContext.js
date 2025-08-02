import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_CONFIG, { getApiUrl } from "../utils/api";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in when app starts
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("authToken");
      const userData = await AsyncStorage.getItem("userData");

      if (token && userData) {
        // Verify token with backend
        const isValid = await verifyToken(token);
        if (isValid) {
          setUser(JSON.parse(userData));
          setIsAuthenticated(true);
        } else {
          // Token expired or invalid, clear storage
          await clearAuthData();
        }
      }
    } catch (error) {
      console.error("Error checking auth state:", error);
      await clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  const verifyToken = async (token) => {
    try {
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.VERIFY_TOKEN),
        {
          method: "POST",
          headers: API_CONFIG.HEADERS,
          body: JSON.stringify({ token }),
          timeout: API_CONFIG.TIMEOUT,
        }
      );

      const data = await response.json();
      return data.success && response.ok;
    } catch (error) {
      console.error("Error verifying token:", error);
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      setIsLoading(true);

      console.log(
        "🔐 Attempting login to:",
        getApiUrl(API_CONFIG.ENDPOINTS.LOGIN)
      );

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.LOGIN), {
        method: "POST",
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify({ email, password }),
        timeout: API_CONFIG.TIMEOUT,
      });

      const data = await response.json();

      console.log("📡 Login response:", {
        status: response.status,
        success: data.success,
      });

      if (response.ok && data.success) {
        // Save auth data
        await AsyncStorage.setItem("authToken", data.token);
        await AsyncStorage.setItem("userData", JSON.stringify(data.user));

        setUser(data.user);
        setIsAuthenticated(true);

        console.log("✅ Login successful for:", data.user.email);
        return { success: true, user: data.user };
      } else {
        console.log("❌ Login failed:", data.error);
        return { success: false, error: data.error || "Login failed" };
      }
    } catch (error) {
      console.error("❌ Login network error:", error);
      return {
        success: false,
        error: "Network error. Please check your connection.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email, password, fullName, phoneNumber) => {
    try {
      setIsLoading(true);

      const url = getApiUrl(API_CONFIG.ENDPOINTS.SIGNUP);
      console.log("📝 Attempting signup to:", url);

      // ✅ Add timeout and better error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(url, {
        method: "POST",
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify({
          email,
          password,
          fullName,
          phoneNumber,
        }),
        signal: controller.signal, // Add abort signal
      });

      clearTimeout(timeoutId);

      console.log("📡 Response status:", response.status);
      console.log("📡 Response headers:", response.headers);

      const data = await response.json();
      console.log("📦 Response data:", data);

      if (response.ok && data.success) {
        // Save auth data
        await AsyncStorage.setItem("authToken", data.token);
        await AsyncStorage.setItem("userData", JSON.stringify(data.user));

        setUser(data.user);
        setIsAuthenticated(true);

        console.log("✅ Signup successful for:", data.user.email);
        return { success: true, user: data.user };
      } else {
        console.log("❌ Signup failed:", data.error);
        return { success: false, error: data.error || "Signup failed" };
      }
    } catch (error) {
      console.error("❌ Signup network error:", error);

      // ✅ Better error messages
      if (error.name === "AbortError") {
        return { success: false, error: "Request timeout. Please try again." };
      }
      if (error.message.includes("Network request failed")) {
        return {
          success: false,
          error:
            "Cannot connect to server. Please check if backend is running.",
        };
      }

      return {
        success: false,
        error: "Network error. Please check your connection.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await clearAuthData();
      setUser(null);
      setIsAuthenticated(false);
      console.log("👋 User logged out");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearAuthData = async () => {
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("userData");
  };

  const getProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        return { success: false, error: "No token found" };
      }

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.PROFILE), {
        method: "GET",
        headers: {
          ...API_CONFIG.HEADERS,
          Authorization: `Bearer ${token}`,
        },
        timeout: API_CONFIG.TIMEOUT,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || "Failed to get profile" };
      }
    } catch (error) {
      console.error("Get profile error:", error);
      return { success: false, error: "Network error" };
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    getProfile,
    checkAuthState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
