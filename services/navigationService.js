import { Platform } from "react-native";
import { MAPBOX_CONFIG } from "../utils/mapboxConfig";

class NavigationService {
  constructor() {
    this.isNavigating = false;
    this.currentRoute = null;
    this.currentStep = 0;
    this.instructions = [];
    this.voiceEnabled = true;
    this.listeners = [];
    this.mapboxDirectionsClient = null;

    // Initialize Mapbox Directions API client if available
    this.initializeMapboxDirections();
  }

  // Initialize Mapbox Directions API
  async initializeMapboxDirections() {
    try {
      const mapboxSdk = require("@mapbox/mapbox-sdk");
      const mapboxDirections = require("@mapbox/mapbox-sdk/services/directions");

      const mapboxClient = mapboxSdk({
        accessToken: MAPBOX_CONFIG.ACCESS_TOKEN,
      });
      this.mapboxDirectionsClient = mapboxDirections(mapboxClient);
    } catch (error) {
      console.warn("Mapbox SDK not available, using fallback routing:", error);
    }
  }

  // Subscribe to navigation updates
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  // Notify all listeners
  notifyListeners(update) {
    this.listeners.forEach((listener) => listener(update));
  }

  // Calculate route using Mapbox Directions API
  async calculateRouteWithMapbox(origin, destination) {
    if (!this.mapboxDirectionsClient) {
      throw new Error("Mapbox Directions client not available");
    }

    try {
      const response = await this.mapboxDirectionsClient
        .getDirections({
          profile: "driving-traffic", // Use traffic-aware routing
          waypoints: [
            {
              coordinates: [origin.longitude, origin.latitude],
            },
            {
              coordinates: [destination.longitude, destination.latitude],
            },
          ],
          alternatives: true,
          steps: true,
          continue_straight: true,
          annotations: ["duration", "distance", "speed"],
          language: "en",
          overview: "full",
          geometries: "geojson",
        })
        .send();

      if (
        response &&
        response.body &&
        response.body.routes &&
        response.body.routes.length > 0
      ) {
        const route = response.body.routes[0];

        return {
          coordinates: route.geometry.coordinates,
          distance: route.distance,
          duration: route.duration,
          steps: route.legs[0].steps.map((step, index) => ({
            distance: step.distance,
            duration: step.duration,
            instruction:
              step.maneuver.instruction ||
              this.generateInstruction(step.maneuver),
            maneuver: step.maneuver,
            geometry: step.geometry,
            stepIndex: index,
            name: step.name || "",
            destinations: step.destinations || "",
            exits: step.exits || "",
            pronunciation: step.pronunciation || null,
          })),
          // Additional Mapbox-specific data
          traffic: this.extractTrafficInfo(route),
          alternatives: response.body.routes.slice(1).map((alt) => ({
            coordinates: alt.geometry.coordinates,
            distance: alt.distance,
            duration: alt.duration,
            traffic: this.extractTrafficInfo(alt),
          })),
        };
      }

      throw new Error("No route found in Mapbox response");
    } catch (error) {
      console.warn("Mapbox routing failed:", error);
      throw error;
    }
  }

  // Extract traffic information from Mapbox route
  extractTrafficInfo(route) {
    if (!route.duration_traffic) {
      return {
        condition: "unknown",
        originalDuration: route.duration,
        adjustedDuration: route.duration,
        delayMinutes: 0,
      };
    }

    const trafficDuration = route.duration_traffic;
    const normalDuration = route.duration;
    const delaySeconds = trafficDuration - normalDuration;
    const delayMinutes = Math.round(delaySeconds / 60);

    let condition = "light";
    if (delaySeconds > 600)
      condition = "severe"; // > 10 min delay
    else if (delaySeconds > 300)
      condition = "heavy"; // > 5 min delay
    else if (delaySeconds > 120) condition = "moderate"; // > 2 min delay

    return {
      condition,
      originalDuration: normalDuration,
      adjustedDuration: trafficDuration,
      delayMinutes: Math.max(0, delayMinutes),
    };
  }

  // Calculate route between two points (with Mapbox fallback to OSRM)
  async calculateRoute(origin, destination) {
    try {
      // Try Mapbox first
      return await this.calculateRouteWithMapbox(origin, destination);
    } catch (error) {
      console.warn("Mapbox routing failed, trying OSRM fallback:", error);

      // Fallback to OSRM
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?steps=true&geometries=geojson&overview=full`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];

          return {
            coordinates: route.geometry.coordinates,
            distance: route.distance,
            duration: route.duration,
            steps: route.legs[0].steps.map((step, index) => ({
              distance: step.distance,
              duration: step.duration,
              instruction:
                step.maneuver.instruction ||
                this.generateInstruction(step.maneuver),
              maneuver: step.maneuver,
              geometry: step.geometry,
              stepIndex: index,
            })),
            traffic: this.simulateTrafficForFallback(route.duration),
          };
        }

        throw new Error("No route found in OSRM response");
      } catch (osrmError) {
        console.warn("OSRM routing also failed:", osrmError);
        return this.generateFallbackRoute(origin, destination);
      }
    }
  }

  // Simulate traffic for fallback routing
  simulateTrafficForFallback(baseDuration) {
    const trafficFactors = {
      light: 1.0,
      moderate: 1.2,
      heavy: 1.5,
      severe: 2.0,
    };

    const conditions = Object.keys(trafficFactors);
    const randomCondition =
      conditions[Math.floor(Math.random() * conditions.length)];
    const adjustedDuration = baseDuration * trafficFactors[randomCondition];

    return {
      condition: randomCondition,
      originalDuration: baseDuration,
      adjustedDuration,
      delayMinutes: Math.round((adjustedDuration - baseDuration) / 60),
    };
  }

  // Generate fallback route for offline use
  generateFallbackRoute(origin, destination) {
    const distance = this.calculateDistance(origin, destination);
    const bearing = this.calculateBearing(origin, destination);

    return {
      coordinates: [
        [origin.longitude, origin.latitude],
        [destination.longitude, destination.latitude],
      ],
      distance: distance * 1000, // Convert to meters
      duration: (distance / 50) * 3600, // Assume 50 km/h average speed
      steps: [
        {
          distance: distance * 1000,
          duration: (distance / 50) * 3600,
          instruction: `Head ${this.bearingToDirection(bearing)} toward destination`,
          maneuver: { type: "depart", instruction: "Head toward destination" },
          geometry: {
            coordinates: [
              [origin.longitude, origin.latitude],
              [destination.longitude, destination.latitude],
            ],
          },
          stepIndex: 0,
        },
        {
          distance: 0,
          duration: 0,
          instruction: "You have arrived at your destination",
          maneuver: { type: "arrive", instruction: "Arrive at destination" },
          geometry: {
            coordinates: [[destination.longitude, destination.latitude]],
          },
          stepIndex: 1,
        },
      ],
      traffic: {
        condition: "unknown",
        originalDuration: (distance / 50) * 3600,
        adjustedDuration: (distance / 50) * 3600,
        delayMinutes: 0,
      },
    };
  }

  // Start navigation
  async startNavigation(origin, destination) {
    try {
      this.isNavigating = true;
      this.currentStep = 0;

      // Calculate route
      const route = await this.calculateRoute(origin, destination);
      this.currentRoute = route;
      this.instructions = route.steps;

      // Start voice guidance
      if (this.voiceEnabled) {
        this.speak("Navigation started. " + this.instructions[0]?.instruction);
      }

      this.notifyListeners({
        type: "navigation_started",
        route,
        instructions: this.instructions,
        currentStep: this.currentStep,
        traffic: route.traffic,
      });

      return route;
    } catch (error) {
      console.error("Failed to start navigation:", error);
      this.stopNavigation();
      throw error;
    }
  }

  // Stop navigation
  stopNavigation() {
    this.isNavigating = false;
    this.currentRoute = null;
    this.currentStep = 0;
    this.instructions = [];

    if (this.voiceEnabled) {
      this.speak("Navigation stopped");
    }

    this.notifyListeners({
      type: "navigation_stopped",
    });
  }

  // Update navigation progress
  updateProgress(currentLocation) {
    if (!this.isNavigating || !this.currentRoute) return;

    const currentInstruction = this.instructions[this.currentStep];
    if (!currentInstruction) return;

    // Check if we're close enough to the next step
    const distanceToNextStep = this.calculateDistance(currentLocation, {
      latitude: currentInstruction.geometry.coordinates[0][1],
      longitude: currentInstruction.geometry.coordinates[0][0],
    });

    // If within 30 meters of next step, advance (more precise for mobile)
    if (distanceToNextStep < 0.03) {
      // 30 meters in km
      this.advanceToNextStep();
    }

    this.notifyListeners({
      type: "progress_updated",
      currentLocation,
      currentStep: this.currentStep,
      distanceToNextStep: distanceToNextStep * 1000,
    });
  }

  // Advance to next navigation step
  advanceToNextStep() {
    if (this.currentStep < this.instructions.length - 1) {
      this.currentStep++;
      const nextInstruction = this.instructions[this.currentStep];

      if (this.voiceEnabled && nextInstruction) {
        this.speak(nextInstruction.instruction);
      }

      this.notifyListeners({
        type: "step_advanced",
        currentStep: this.currentStep,
        instruction: nextInstruction,
      });
    } else {
      // Navigation completed
      this.completeNavigation();
    }
  }

  // Complete navigation
  completeNavigation() {
    if (this.voiceEnabled) {
      this.speak("You have arrived at your destination");
    }

    this.notifyListeners({
      type: "navigation_completed",
    });

    this.stopNavigation();
  }

  // Text-to-speech functionality
  speak(text) {
    if (Platform.OS === "web") {
      // Use Web Speech API
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.volume = 0.8;
        window.speechSynthesis.speak(utterance);
      }
    } else {
      // Use Expo Speech for mobile
      try {
        const Speech = require("expo-speech");
        Speech.speak(text, {
          language: "en-US",
          pitch: 1.0,
          rate: 0.8,
        });
      } catch (error) {
        console.warn("Speech not available:", error);
      }
    }
  }

  // Toggle voice guidance
  toggleVoice() {
    this.voiceEnabled = !this.voiceEnabled;
    return this.voiceEnabled;
  }

  // Calculate distance between two points (Haversine formula)
  calculateDistance(point1, point2) {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(point2.latitude - point1.latitude);
    const dLon = this.toRadians(point2.longitude - point1.longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(point1.latitude)) *
        Math.cos(this.toRadians(point2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Calculate bearing between two points
  calculateBearing(point1, point2) {
    const dLon = this.toRadians(point2.longitude - point1.longitude);
    const lat1 = this.toRadians(point1.latitude);
    const lat2 = this.toRadians(point2.latitude);

    const y = Math.sin(dLon) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

    return this.toDegrees(Math.atan2(y, x));
  }

  // Convert bearing to direction
  bearingToDirection(bearing) {
    const normalizedBearing = ((bearing % 360) + 360) % 360;
    const directions = [
      "north",
      "northeast",
      "east",
      "southeast",
      "south",
      "southwest",
      "west",
      "northwest",
    ];
    const index = Math.round(normalizedBearing / 45) % 8;
    return directions[index];
  }

  // Generate instruction from maneuver
  generateInstruction(maneuver) {
    const type = maneuver.type;
    const modifier = maneuver.modifier;

    switch (type) {
      case "depart":
        return "Head toward your destination";
      case "turn":
        return `Turn ${modifier || "ahead"}`;
      case "continue":
        return "Continue straight";
      case "arrive":
        return "You have arrived at your destination";
      case "merge":
        return `Merge ${modifier || "ahead"}`;
      case "ramp":
        return `Take the ramp ${modifier || "ahead"}`;
      case "roundabout":
        return `Enter the roundabout and take the ${modifier || "first"} exit`;
      case "rotary":
        return `Enter the rotary and take the ${modifier || "first"} exit`;
      case "roundabout turn":
        return `At the roundabout, take the ${modifier || "first"} exit`;
      case "notification":
        return maneuver.instruction || "Continue ahead";
      case "new name":
        return `Continue onto ${maneuver.instruction || "the road"}`;
      case "fork":
        return `At the fork, keep ${modifier || "straight"}`;
      case "end of road":
        return `At the end of the road, turn ${modifier || "ahead"}`;
      case "use lane":
        return "Use the indicated lane";
      default:
        return maneuver.instruction || `Continue ${modifier || "ahead"}`;
    }
  }

  // Utility functions
  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  toDegrees(radians) {
    return radians * (180 / Math.PI);
  }

  // Get current navigation state
  getNavigationState() {
    return {
      isNavigating: this.isNavigating,
      currentRoute: this.currentRoute,
      currentStep: this.currentStep,
      instructions: this.instructions,
      voiceEnabled: this.voiceEnabled,
      traffic: this.currentRoute?.traffic || null,
    };
  }

  // Route optimization using Mapbox alternatives
  async optimizeRoute(origin, destination, options = {}) {
    try {
      const route = await this.calculateRouteWithMapbox(origin, destination);

      // Return the best route plus alternatives
      const routes = [route, ...(route.alternatives || [])];

      return routes
        .map((r, index) => ({
          ...r,
          routeIndex: index,
          score: this.calculateRouteScore(r, options),
        }))
        .sort((a, b) => a.score - b.score);
    } catch (error) {
      console.warn("Route optimization failed, using fallback:", error);
      const fallbackRoute = await this.calculateRoute(origin, destination);
      return [{ ...fallbackRoute, routeIndex: 0, score: 1 }];
    }
  }

  // Calculate route score for optimization
  calculateRouteScore(route, options = {}) {
    const weights = {
      duration: options.prioritizeTime ? 0.7 : 0.4,
      distance: options.prioritizeDistance ? 0.7 : 0.3,
      traffic: 0.3,
    };

    // Use traffic-adjusted duration if available
    const duration = route.traffic?.adjustedDuration || route.duration;
    const trafficPenalty = route.traffic?.delayMinutes || 0;

    // Normalize values (lower is better)
    const durationScore = duration / 3600; // Convert to hours
    const distanceScore = route.distance / 1000; // Convert to km
    const trafficScore = trafficPenalty / 10; // Normalize delay

    return (
      durationScore * weights.duration +
      distanceScore * weights.distance +
      trafficScore * weights.traffic
    );
  }
}

// Create singleton instance
const navigationService = new NavigationService();

export default navigationService;
