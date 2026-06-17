import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import OrbitLine from "./OrbitLine";
import SatelliteMarker from "./SatelliteMarker";
import Starfield from "./Starfield";

const GLOBE_RADIUS = 2.1;

function Globe() {
  const earthOutlineTexture = useTexture("/textures/earth-outline.png");

  return (
    <group>
      {/* Transparent wireframe Earth */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
        <meshStandardMaterial
          color="#00ffff"
          wireframe
          transparent
          opacity={0.05}
          depthWrite={false}
        />
      </mesh>
\
      {/* Back-side continent outlines, faded */}
      <mesh scale={1.01} renderOrder={1}>
        <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
        <meshBasicMaterial
          map={earthOutlineTexture}
          transparent
          opacity={0.22}
          color="#00ffff"
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Front-side continent outlines, bright */}
      <mesh scale={1.012} renderOrder={2}>
        <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
        <meshBasicMaterial
          map={earthOutlineTexture}
          transparent
          color="#00ffff"
          opacity={0.9}
          side={THREE.FrontSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export default function GlobeScene() {
  return (
    <div className="globe-scene">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={1} />

        <Starfield />
        <Globe />
        <OrbitLine globeRadius={GLOBE_RADIUS} />
        <SatelliteMarker globeRadius={GLOBE_RADIUS} />


        <OrbitControls />
      </Canvas>
    </div>
  );
}