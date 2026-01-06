import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import type { Neo } from "../../types";

interface AsteroidProps {
  asteroid: Neo;
}

export function Asteroid({asteroid}: AsteroidProps) {
  const meshRef = useRef<THREE.Mesh>(null!);

  // Calculate size based on asteroid diameter (scaled for visibility)
  const size = useMemo(() => {
    const avgSize = (asteroid.size.min + asteroid.size.max) / 2;
    // Scale down large asteroids to reasonable visual size (0.5 to 2.5)
    return Math.min(Math.max(avgSize / 100, 0.5), 2.5);
  }, [asteroid]);

  // Calculate speed multiplier based on relative velocity
  

  // Generate unique color based on asteroid ID
  const color = useMemo(() => {
    // Hash the ID to get a consistent random value
    let hash = 0;
    for (let i = 0; i < asteroid.id.length; i++) {
      hash = asteroid.id.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Generate brown/stone variations
    const hue = 25 + (Math.abs(hash % 20)); // 25-45 (orange-brown range)
    const saturation = 20 + (Math.abs(hash % 25)); // 20-45%
    const lightness = 35 + (Math.abs((hash >> 8) % 25)); // 35-60%
    
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }, [asteroid.id]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;

      // Create orbital motion
      const radius = 3;
      meshRef.current.position.x =
        Math.sin(state.clock.elapsedTime * 0.3) * radius;
      meshRef.current.position.z =
        Math.cos(state.clock.elapsedTime * 0.3) * radius;
      meshRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
    }
  });

  return (
    <mesh ref={meshRef}>
      <dodecahedronGeometry args={[size, 1]} />
      <meshStandardMaterial color={color} roughness={0.8} metalness={0.2} />
    </mesh>
  );
}