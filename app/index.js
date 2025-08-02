import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import { LoadingSpinner } from "../components";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuthState } = useAuth();

  useEffect(() => {
    // Re-check auth state when component mounts
    checkAuthState();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // User is logged in, go to dashboard
        router.replace("/dashboard");
      } else {
        // User is not logged in, go to auth flow
        router.replace("/auth/identitas");
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading while checking authentication
  return <LoadingSpinner />;
}
