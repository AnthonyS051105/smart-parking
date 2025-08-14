import { Platform } from 'react-native';

class NavigationService {
  constructor() {
    this.isNavigating = false;
    this.currentRoute = null;
    this.currentStep = 0;
    this.instructions = [];
    this.voiceEnabled = true;
    this.listeners = [];
  }

  // Subscribe to navigation updates
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify all listeners
  notifyListeners(update) {
    this.listeners.forEach(listener => listener(update));
  }

  // Calculate route between two points
  async calculateRoute(origin, destination) {
    try {
      // Use OSRM (Open Source Routing Machine) API for route calculation
      const url = `https://router.project-osrm.org/route/v1/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?steps=true&geometries=geojson&overview=full`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        
        // Transform route data
        const transformedRoute = {
          coordinates: route.geometry.coordinates,
          distance: route.distance,
          duration: route.duration,
          steps: route.legs[0].steps.map((step, index) => ({
            distance: step.distance,
            duration: step.duration,
            instruction: step.maneuver.instruction || this.generateInstruction(step.maneuver),
            maneuver: step.maneuver,
            geometry: step.geometry,
            stepIndex: index
          }))
        };

        return transformedRoute;
      }
      
      throw new Error('No route found');
    } catch (error) {
      console.warn('Route calculation failed, using fallback:', error);
      return this.generateFallbackRoute(origin, destination);
    }
  }

  // Generate fallback route for offline use
  generateFallbackRoute(origin, destination) {
    const distance = this.calculateDistance(origin, destination);
    const bearing = this.calculateBearing(origin, destination);
    
    return {
      coordinates: [
        [origin.longitude, origin.latitude],
        [destination.longitude, destination.latitude]
      ],
      distance: distance * 1000, // Convert to meters
      duration: (distance / 50) * 3600, // Assume 50 km/h average speed
      steps: [
        {
          distance: distance * 1000,
          duration: (distance / 50) * 3600,
          instruction: `Head ${this.bearingToDirection(bearing)} toward destination`,
          maneuver: { type: 'depart', instruction: 'Head toward destination' },
          geometry: { coordinates: [[origin.longitude, origin.latitude], [destination.longitude, destination.latitude]] },
          stepIndex: 0
        },
        {
          distance: 0,
          duration: 0,
          instruction: 'You have arrived at your destination',
          maneuver: { type: 'arrive', instruction: 'Arrive at destination' },
          geometry: { coordinates: [[destination.longitude, destination.latitude]] },
          stepIndex: 1
        }
      ]
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
        this.speak('Navigation started. ' + this.instructions[0]?.instruction);
      }

      this.notifyListeners({
        type: 'navigation_started',
        route,
        instructions: this.instructions,
        currentStep: this.currentStep
      });

      return route;
    } catch (error) {
      console.error('Failed to start navigation:', error);
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
      this.speak('Navigation stopped');
    }

    this.notifyListeners({
      type: 'navigation_stopped'
    });
  }

  // Update navigation progress
  updateProgress(currentLocation) {
    if (!this.isNavigating || !this.currentRoute) return;

    const currentInstruction = this.instructions[this.currentStep];
    if (!currentInstruction) return;

    // Check if we're close enough to the next step
    const distanceToNextStep = this.calculateDistance(
      currentLocation,
      {
        latitude: currentInstruction.geometry.coordinates[0][1],
        longitude: currentInstruction.geometry.coordinates[0][0]
      }
    );

    // If within 50 meters of next step, advance
    if (distanceToNextStep < 0.05) { // 50 meters in km
      this.advanceToNextStep();
    }

    this.notifyListeners({
      type: 'progress_updated',
      currentLocation,
      currentStep: this.currentStep,
      distanceToNextStep: distanceToNextStep * 1000
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
        type: 'step_advanced',
        currentStep: this.currentStep,
        instruction: nextInstruction
      });
    } else {
      // Navigation completed
      this.completeNavigation();
    }
  }

  // Complete navigation
  completeNavigation() {
    if (this.voiceEnabled) {
      this.speak('You have arrived at your destination');
    }

    this.notifyListeners({
      type: 'navigation_completed'
    });

    this.stopNavigation();
  }

  // Text-to-speech functionality
  speak(text) {
    if (Platform.OS === 'web') {
      // Use Web Speech API
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.volume = 0.8;
        window.speechSynthesis.speak(utterance);
      }
    } else {
      // Use Expo Speech for mobile
      try {
        const Speech = require('expo-speech');
        Speech.speak(text, {
          language: 'en-US',
          pitch: 1.0,
          rate: 0.8,
        });
      } catch (error) {
        console.warn('Speech not available:', error);
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
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(point1.latitude)) * Math.cos(this.toRadians(point2.latitude)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Calculate bearing between two points
  calculateBearing(point1, point2) {
    const dLon = this.toRadians(point2.longitude - point1.longitude);
    const lat1 = this.toRadians(point1.latitude);
    const lat2 = this.toRadians(point2.latitude);

    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

    return this.toDegrees(Math.atan2(y, x));
  }

  // Convert bearing to direction
  bearingToDirection(bearing) {
    const normalizedBearing = ((bearing % 360) + 360) % 360;
    const directions = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'];
    const index = Math.round(normalizedBearing / 45) % 8;
    return directions[index];
  }

  // Generate instruction from maneuver
  generateInstruction(maneuver) {
    const type = maneuver.type;
    const modifier = maneuver.modifier;

    switch (type) {
      case 'depart':
        return 'Head toward your destination';
      case 'turn':
        return `Turn ${modifier || 'ahead'}`;
      case 'continue':
        return 'Continue straight';
      case 'arrive':
        return 'You have arrived at your destination';
      case 'merge':
        return `Merge ${modifier || 'ahead'}`;
      case 'ramp':
        return `Take the ramp ${modifier || 'ahead'}`;
      case 'roundabout':
        return `Enter the roundabout and take the ${modifier || 'first'} exit`;
      default:
        return `Continue ${modifier || 'ahead'}`;
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
      voiceEnabled: this.voiceEnabled
    };
  }

  // Simulate real-time traffic (for demo purposes)
  simulateTraffic() {
    if (!this.currentRoute) return null;

    // Simulate traffic conditions
    const trafficFactors = {
      light: 1.0,
      moderate: 1.3,
      heavy: 1.8,
      severe: 2.5
    };

    const conditions = Object.keys(trafficFactors);
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    const adjustedDuration = this.currentRoute.duration * trafficFactors[randomCondition];

    return {
      condition: randomCondition,
      originalDuration: this.currentRoute.duration,
      adjustedDuration,
      delayMinutes: Math.round((adjustedDuration - this.currentRoute.duration) / 60)
    };
  }

  // Route optimization (find fastest route among alternatives)
  async optimizeRoute(origin, destination, options = {}) {
    try {
      // Calculate multiple route alternatives
      const baseUrl = 'https://router.project-osrm.org/route/v1/driving';
      const alternatives = options.alternatives || 3;
      
      const url = `${baseUrl}/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?alternatives=${alternatives}&steps=true&geometries=geojson&overview=full`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        // Sort routes by duration (fastest first)
        const sortedRoutes = data.routes
          .map((route, index) => ({
            ...route,
            routeIndex: index,
            score: this.calculateRouteScore(route, options)
          }))
          .sort((a, b) => a.score - b.score);

        return sortedRoutes.map(route => ({
          coordinates: route.geometry.coordinates,
          distance: route.distance,
          duration: route.duration,
          routeIndex: route.routeIndex,
          score: route.score,
          steps: route.legs[0].steps.map((step, index) => ({
            distance: step.distance,
            duration: step.duration,
            instruction: step.maneuver.instruction || this.generateInstruction(step.maneuver),
            maneuver: step.maneuver,
            geometry: step.geometry,
            stepIndex: index
          }))
        }));
      }

      return [await this.calculateRoute(origin, destination)];
    } catch (error) {
      console.warn('Route optimization failed:', error);
      return [await this.calculateRoute(origin, destination)];
    }
  }

  // Calculate route score for optimization
  calculateRouteScore(route, options = {}) {
    const weights = {
      duration: options.prioritizeTime ? 0.7 : 0.4,
      distance: options.prioritizeDistance ? 0.7 : 0.3,
      complexity: 0.3 // Number of turns/complexity
    };

    const complexity = route.legs[0].steps.length;
    
    // Normalize values (lower is better)
    const durationScore = route.duration / 3600; // Convert to hours
    const distanceScore = route.distance / 1000; // Convert to km
    const complexityScore = complexity / 20; // Normalize turn count

    return (
      durationScore * weights.duration +
      distanceScore * weights.distance +
      complexityScore * weights.complexity
    );
  }
}

// Create singleton instance
const navigationService = new NavigationService();

export default navigationService;