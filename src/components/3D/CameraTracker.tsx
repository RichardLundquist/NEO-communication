import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export function CameraTracker() {
  const { gl } = useThree();
  const radiusRef = useRef(8);

  useEffect(() => {
    const canvas = gl.domElement;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      radiusRef.current = THREE.MathUtils.clamp(
        radiusRef.current + e.deltaY * 0.01,
        2,
        20
      );
    };

    canvas.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, [gl]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Target position (Head is at 0,0,0)
    /* const targetX = 0;
    const targetY = 0;
    const targetZ = 0; */

    const radius = 1;

    const targetX = Math.sin(time * 0.1) * radius;
    const targetY = Math.cos(time * 0.1) * radius;
    const targetZ = Math.sin(time * 0.3) * 0.5;

    /* const asteroidX = Math.sin(time * 0.3) * radius;
    const asteroidZ = Math.cos(time * 0.3) * radius;
    const asteroidY = Math.sin(time * 0.5) * 0.5; */

    // Camera orbits at a different speed to show movement
    const cameraSpeed = 0.15; // Slower than asteroid
    
    // Update camera radius based on scroll
    const currentRadius = THREE.MathUtils.lerp(
      Math.sqrt(
        state.camera.position.x ** 2 +
        state.camera.position.z ** 2
      ) || 8,
      radiusRef.current,
      0.1
    );

    state.camera.position.x = Math.sin(time * cameraSpeed) * currentRadius;
    state.camera.position.z = Math.cos(time * cameraSpeed) * currentRadius;
    state.camera.position.y = 3 + Math.sin(time * 0.2) * 1;

    // Make camera look at center
    state.camera.lookAt(targetX, targetY, targetZ);
  });

  return null;
}