"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COLORS_HEX } from "@/lib/constants";
import { scrollState } from "@/lib/store";

const RADIUS = 1.6;

/**
 * The hero centrepiece: a slow, dark globe with a scattering of surface points.
 * Rotates slowly and drifts with the pointer.
 */
export function HeroGlobe({ pointCount = 260 }: { pointCount?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  // Surface points as a single Points cloud.
  const pointPositions = useMemo(() => {
    const arr = new Float32Array(pointCount * 3);
    for (let i = 0; i < pointCount; i++) {
      // Even-ish distribution via golden spiral.
      const y = 1 - (i / (pointCount - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const phi = i * Math.PI * (3 - Math.sqrt(5));
      arr[i * 3 + 0] = Math.cos(phi) * r * RADIUS;
      arr[i * 3 + 1] = y * RADIUS;
      arr[i * 3 + 2] = Math.sin(phi) * r * RADIUS;
    }
    return arr;
  }, [pointCount]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.08;

    // Pointer parallax — ease the group toward a small tilt.
    const targetX = scrollState.pointerY * 0.15;
    const targetY = scrollState.pointerX * 0.25;
    groupRef.current.rotation.x +=
      (targetX - groupRef.current.rotation.x) * 0.05;
    groupRef.current.position.x +=
      (targetY * 0.4 - groupRef.current.position.x) * 0.05;
  });

  return (
    <group ref={groupRef}>
      {/* Dark globe body. */}
      <mesh>
        <sphereGeometry args={[RADIUS, 64, 64]} />
        <meshStandardMaterial
          color={COLORS_HEX.charcoal}
          emissive={COLORS_HEX.redOrange}
          emissiveIntensity={0.04}
          roughness={0.75}
          metalness={0.2}
        />
      </mesh>

      {/* Faint wireframe shell for structure. */}
      <mesh>
        <icosahedronGeometry args={[RADIUS + 0.005, 4]} />
        <meshBasicMaterial
          color={COLORS_HEX.ember}
          wireframe
          transparent
          opacity={0.06}
        />
      </mesh>

      {/* Surface points. */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[pointPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          color={COLORS_HEX.amber}
          transparent
          opacity={0.7}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
}
