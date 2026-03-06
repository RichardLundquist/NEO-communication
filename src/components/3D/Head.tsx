

import React, { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'

export function Head({ modelUrl = '/head.glb', ...props }) {
  const { nodes } = useGLTF(modelUrl)

  const colors = ["red", "green", "blue", "yellow", "cyan", "magenta"];

  const randomColor = useMemo(() => {
    const index = Math.floor(Math.random() * colors.length);
    return colors[index];
  }, [])

  const randomScale = useMemo(() => {
    return 1 + Math.random() * 2; // Scale between 1 and 3
  }, [])
  
  // Find the first mesh geometry if "Head" node doesn't exist
  const geometry = useMemo(() => {
    if (nodes.Head) return nodes.Head.geometry
    const firstMesh = Object.values(nodes).find((node: any) => node.isMesh)
    return firstMesh ? (firstMesh as any).geometry : null
  }, [nodes])

  if (!geometry) return null

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={geometry}
        scale={randomScale}
      >

      <meshStandardMaterial 
         color={randomColor} roughness={0.4} metalness={0.05} />
      </mesh>
    </group>
  )
}

// Preload all variants
;['/head.glb', '/head2.glb', '/head3.glb'].forEach(path => useGLTF.preload(path))