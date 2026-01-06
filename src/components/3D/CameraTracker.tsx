import { useFrame } from "@react-three/fiber";
import { useEffect, useState } from "react";
import * as THREE from "three";

export function CameraTracker() {
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    canvas.addEventListener("mouseenter", handleMouseEnter);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      canvas.removeEventListener("mouseenter", handleMouseEnter);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Calculate asteroid position (must match Asteroid component)
    const radius = 3;
    const asteroidX = Math.sin(time * 0.3) * radius;
    const asteroidZ = Math.cos(time * 0.3) * radius;
    const asteroidY = Math.sin(time * 0.5) * 0.5;

    // Camera orbits at a different speed and radius to show asteroid movement
    const baseCameraRadius = 8;
    const zoomedCameraRadius = 7; // Closer when hovering
    const cameraSpeed = 0.15; // Slower than asteroid
    
    // Smoothly interpolate camera radius based on hover state
    const targetRadius = isHovering ? zoomedCameraRadius : baseCameraRadius;
    const currentRadius = THREE.MathUtils.lerp(
      Math.sqrt(
        state.camera.position.x ** 2 +
        state.camera.position.z ** 2
      ) || baseCameraRadius,
      targetRadius,
      0.05 // Smoothing factor
    );

    state.camera.position.x = Math.sin(time * cameraSpeed) * currentRadius;
    state.camera.position.z = Math.cos(time * cameraSpeed) * currentRadius;
    state.camera.position.y = 3 + Math.sin(time * 0.2) * 1;

    // Make camera look at asteroid
    state.camera.lookAt(asteroidX, asteroidY, asteroidZ);
  });

  return null;
}