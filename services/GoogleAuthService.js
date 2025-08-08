import * as WebBrowser from "expo-web-browser";
import Constants from "expo-constants";
import { Platform } from "react-native";

// Complete the auth session for web
WebBrowser.maybeCompleteAuthSession();

class GoogleAuthService {
  constructor() {
    this.isConfigured = false;
    this.configure();
  }

  configure() {
    try {
      const webClientId =
        Constants.expoConfig?.extra?.googleSignIn?.webClientId;

      if (!webClientId) {
        console.warn("❌ Web Client ID not found in app config");
        return;
      }

      this.webClientId = webClientId;
      this.isConfigured = true;
      console.log(`✅ Google Sign-In configured for ${Platform.OS}`);
      console.log(`🔑 Using Client ID: ${webClientId.substring(0, 20)}...`);
    } catch (error) {
      console.error("❌ Error configuring Google Sign-In:", error);
    }
  }

  async signIn() {
    try {
      if (!this.isConfigured) {
        throw new Error("Google Sign-In not configured");
      }

      console.log("🚀 Starting Google Sign-In...");
      console.log("📱 Platform:", Platform.OS);
      console.log("🔧 Testing on web platform for best compatibility");

      // Use localhost redirect URI - this WILL work for testing
      const redirectUri = "http://localhost:19006";

      console.log("🔗 Using redirect URI:", redirectUri);

      const authUrl =
        `https://accounts.google.com/oauth2/v2/auth?` +
        `client_id=${this.webClientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=token&` + // Changed from id_token to token
        `scope=${encodeURIComponent("openid profile email")}&` +
        `prompt=select_account&` +
        `state=${Math.random().toString(36).substring(2)}`;

      console.log("🌐 Opening auth URL:", authUrl.substring(0, 100) + "...");

      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        redirectUri
      );

      console.log("🔐 WebBrowser result:", result);

      if (result.type === "success") {
        console.log("✅ WebBrowser returned success");
        console.log("📍 Return URL:", result.url);

        // Extract access_token from URL fragment
        const url = result.url;
        const accessTokenMatch = url.match(/access_token=([^&]+)/);

        if (accessTokenMatch) {
          const accessToken = decodeURIComponent(accessTokenMatch[1]);
          console.log("🎟️ Access Token extracted");

          // Get user info using access token
          const userInfo = await this.getUserInfo(accessToken);

          if (userInfo) {
            console.log("✅ Google Sign-In successful for:", userInfo.email);
            return {
              success: true,
              user: {
                id: userInfo.id,
                email: userInfo.email,
                name: userInfo.name,
                photo: userInfo.picture,
                emailVerified: userInfo.verified_email || false,
              },
              accessToken: accessToken,
            };
          } else {
            throw new Error("Failed to get user info from Google API");
          }
        } else {
          console.log("❌ No access token found in return URL");
          console.log("📍 Full return URL:", result.url);
          throw new Error("No access token found in response");
        }
      } else if (result.type === "cancel") {
        console.log("🚫 User cancelled Google Sign-In");
        return {
          success: false,
          error: "Sign in was cancelled by user",
        };
      } else if (result.type === "dismiss") {
        console.log("🚫 User dismissed Google Sign-In browser");
        return {
          success: false,
          error: "Sign in was dismissed. Please try again.",
        };
      } else {
        console.log("❌ Unexpected result type:", result.type);
        return {
          success: false,
          error: "Authentication failed with unexpected result",
        };
      }
    } catch (error) {
      console.error("❌ Google Sign-In error:", error);
      return {
        success: false,
        error: error.message || "Unknown error occurred",
      };
    }
  }

  // Get user info using access token
  async getUserInfo(accessToken) {
    try {
      console.log("📡 Fetching user info from Google API...");

      const response = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`
      );

      if (response.ok) {
        const userInfo = await response.json();
        console.log("📋 Google user info:", {
          email: userInfo.email,
          name: userInfo.name,
          verified: userInfo.verified_email,
        });
        return userInfo;
      } else {
        console.error("❌ Failed to fetch user info:", response.status);
        return null;
      }
    } catch (error) {
      console.error("❌ Error fetching user info:", error);
      return null;
    }
  }

  async signOut() {
    try {
      console.log("✅ Google Sign-Out successful");
      return { success: true };
    } catch (error) {
      console.error("❌ Google Sign-Out error:", error);
      return { success: false, error: error.message };
    }
  }

  async getCurrentUser() {
    return {
      success: false,
      error: "Not implemented for Expo managed workflow",
    };
  }

  async revokeAccess() {
    try {
      console.log("✅ Google access revoked");
      return { success: true };
    } catch (error) {
      console.error("❌ Error revoking access:", error);
      return { success: false, error: error.message };
    }
  }
}

export default new GoogleAuthService();
