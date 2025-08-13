import { useState, useRef } from "react";
import { mapboxDirectionsService } from "../services/mapboxService";
import * as Speech from "expo-speech";

export const useNavigation = () => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [route, setRoute] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [instructions, setInstructions] = useState([]);
  const [eta, setEta] = useState(null);
  const [distance, setDistance] = useState(null);

  const startNavigation = async (origin, destination) => {
    try {
      const routeData = await mapboxDirectionsService.getDirections(
        origin,
        destination
      );

      setRoute(routeData.geometry);
      setInstructions(routeData.steps);
      setEta(routeData.duration);
      setDistance(routeData.distance);
      setCurrentStep(0);
      setIsNavigating(true);

      // Announce first instruction
      announceInstruction(routeData.steps[0]?.maneuver?.instruction);
    } catch (error) {
      console.error("Failed to start navigation:", error);
    }
  };

  const stopNavigation = () => {
    setIsNavigating(false);
    setRoute(null);
    setInstructions([]);
    setCurrentStep(0);
    setEta(null);
    setDistance(null);
  };

  const announceInstruction = (instruction) => {
    if (instruction) {
      Speech.speak(instruction, {
        language: "id-ID", // Indonesian
        pitch: 1.0,
        rate: 0.8,
      });
    }
  };

  const updateNavigationProgress = (userLocation) => {
    if (!isNavigating || !instructions.length) return;

    const nextStep = instructions[currentStep];
    if (!nextStep) return;

    const stepLocation = {
      latitude: nextStep.maneuver.location[1],
      longitude: nextStep.maneuver.location[0],
    };

    const distance = calculateDistance(userLocation, stepLocation);

    // If within 30 meters of next instruction
    if (distance < 30 && currentStep < instructions.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      announceInstruction(instructions[newStep]?.maneuver?.instruction);
    }

    // Check if arrived
    if (currentStep >= instructions.length - 1) {
      announceInstruction("Anda telah sampai di tujuan");
      stopNavigation();
    }
  };

  const calculateDistance = (point1, point2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (point1.latitude * Math.PI) / 180;
    const φ2 = (point2.latitude * Math.PI) / 180;
    const Δφ = ((point2.latitude - point1.latitude) * Math.PI) / 180;
    const Δλ = ((point2.longitude - point1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  return {
    isNavigating,
    route,
    currentStep,
    instructions,
    eta,
    distance,
    startNavigation,
    stopNavigation,
    updateNavigationProgress,
  };
};
