import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

type SatelliteMarkerProps = {
  globeRadius: number;
};

const ORBIT_ROTATION: [number, number, number] = [0.8, 0.2, 0.6];

export default function SatelliteMarker({ globeRadius }: SatelliteMarkerProps) {
  const satelliteRef = useRef<THREE.Group>(null);

  const orbitRadius = globeRadius * 1.45;

  // Radians per second. Increase this to make it faster.
  const speed = 0.05;

  useFrame(({ clock }) => {
    if (!satelliteRef.current) return;

    const angle = clock.getElapsedTime() * speed;

    const x = Math.cos(angle) * orbitRadius;
    const y = 0;
    const z = Math.sin(angle) * orbitRadius;

    satelliteRef.current.position.set(x, y, z);
  });

  return (
    <group rotation={ORBIT_ROTATION}>
      <group ref={satelliteRef}>
        {/* Outer red glow */}
        <mesh>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshBasicMaterial
            color="#ff0033"
            transparent
            opacity={0.28}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Main satellite dot */}
        <mesh>
          <sphereGeometry args={[0.07, 32, 32]} />
          <meshBasicMaterial color="#ff0033" />
        </mesh>
      </group>
    </group>
  );
}