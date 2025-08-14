import { useState, useEffect, useCallback, useRef } from 'react';
import navigationService from '../services/navigationService';

export const useNavigation = () => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [route, setRoute] = useState(null);
  const [instructions, setInstructions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [trafficInfo, setTrafficInfo] = useState(null);
  const [navigationState, setNavigationState] = useState('idle'); // idle, calculating, navigating, completed
  const unsubscribeRef = useRef(null);

  // Subscribe to navigation service updates
  useEffect(() => {
    const handleNavigationUpdate = (update) => {
      switch (update.type) {
        case 'navigation_started':
          setIsNavigating(true);
          setRoute(update.route);
          setInstructions(update.instructions);
          setCurrentStep(update.currentStep);
          setNavigationState('navigating');
          break;

        case 'navigation_stopped':
          setIsNavigating(false);
          setRoute(null);
          setInstructions([]);
          setCurrentStep(0);
          setNavigationState('idle');
          setTrafficInfo(null);
          break;

        case 'step_advanced':
          setCurrentStep(update.currentStep);
          break;

        case 'progress_updated':
          // Update any progress-related state if needed
          break;

        case 'navigation_completed':
          setNavigationState('completed');
          break;

        default:
          break;
      }
    };

    unsubscribeRef.current = navigationService.subscribe(handleNavigationUpdate);

    // Initialize state from service
    const state = navigationService.getNavigationState();
    setIsNavigating(state.isNavigating);
    setRoute(state.currentRoute);
    setInstructions(state.instructions);
    setCurrentStep(state.currentStep);
    setVoiceEnabled(state.voiceEnabled);

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  // Start navigation
  const startNavigation = useCallback(async (origin, destination, options = {}) => {
    try {
      setNavigationState('calculating');
      
      let selectedRoute;
      if (options.optimize) {
        // Get optimized routes
        const routes = await navigationService.optimizeRoute(origin, destination, options);
        selectedRoute = routes[0]; // Use the best route
      } else {
        selectedRoute = await navigationService.startNavigation(origin, destination);
      }

      // Simulate traffic info
      const traffic = navigationService.simulateTraffic();
      setTrafficInfo(traffic);

      return selectedRoute;
    } catch (error) {
      setNavigationState('idle');
      console.error('Failed to start navigation:', error);
      throw error;
    }
  }, []);

  // Stop navigation
  const stopNavigation = useCallback(() => {
    navigationService.stopNavigation();
  }, []);

  // Update navigation progress
  const updateNavigationProgress = useCallback((currentLocation) => {
    navigationService.updateProgress(currentLocation);
  }, []);

  // Toggle voice guidance
  const toggleVoice = useCallback(() => {
    const newVoiceState = navigationService.toggleVoice();
    setVoiceEnabled(newVoiceState);
    return newVoiceState;
  }, []);

  // Get route alternatives
  const getRouteAlternatives = useCallback(async (origin, destination, options = {}) => {
    try {
      const routes = await navigationService.optimizeRoute(origin, destination, {
        ...options,
        alternatives: options.alternatives || 3
      });
      return routes;
    } catch (error) {
      console.error('Failed to get route alternatives:', error);
      return [];
    }
  }, []);

  // Manually advance to next step (for testing)
  const advanceStep = useCallback(() => {
    navigationService.advanceToNextStep();
  }, []);

  // Get estimated arrival time
  const getEstimatedArrival = useCallback(() => {
    if (!route) return null;

    const now = new Date();
    const remainingDuration = instructions
      .slice(currentStep)
      .reduce((total, instruction) => total + instruction.duration, 0);

    const trafficMultiplier = trafficInfo ? 
      (trafficInfo.adjustedDuration / trafficInfo.originalDuration) : 1;

    const adjustedDuration = remainingDuration * trafficMultiplier;
    const arrivalTime = new Date(now.getTime() + adjustedDuration * 1000);

    return {
      estimatedArrival: arrivalTime,
      remainingTime: adjustedDuration,
      remainingDistance: instructions
        .slice(currentStep)
        .reduce((total, instruction) => total + instruction.distance, 0)
    };
  }, [route, instructions, currentStep, trafficInfo]);

  // Format duration for display
  const formatDuration = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }, []);

  // Format distance for display
  const formatDistance = useCallback((meters) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${Math.round(meters)} m`;
  }, []);

  // Get current instruction
  const getCurrentInstruction = useCallback(() => {
    return instructions[currentStep] || null;
  }, [instructions, currentStep]);

  // Get next instruction
  const getNextInstruction = useCallback(() => {
    return instructions[currentStep + 1] || null;
  }, [instructions, currentStep]);

  // Check if navigation is active
  const isNavigationActive = useCallback(() => {
    return isNavigating && navigationState === 'navigating';
  }, [isNavigating, navigationState]);

  return {
    // State
    isNavigating,
    route,
    instructions,
    currentStep,
    voiceEnabled,
    trafficInfo,
    navigationState,

    // Actions
    startNavigation,
    stopNavigation,
    updateNavigationProgress,
    toggleVoice,
    getRouteAlternatives,
    advanceStep,

    // Computed values
    getCurrentInstruction,
    getNextInstruction,
    getEstimatedArrival,
    isNavigationActive,

    // Utilities
    formatDuration,
    formatDistance,
  };
};
