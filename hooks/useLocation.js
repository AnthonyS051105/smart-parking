import { useState, useEffect } from "react";
import * as Location from "expo-location";

export const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Location permission denied");
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
    } catch (err) {
      setError(err.message);
      // Fallback to Jakarta coordinates
      setLocation({
        latitude: -6.2,
        longitude: 106.816666,
      });
    } finally {
      setLoading(false);
    }
  };

  return { location, loading, error, refetch: getCurrentLocation };
};
