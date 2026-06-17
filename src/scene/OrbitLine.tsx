import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Line } from "@react-three/drei";

type OrbitLineProps = {
  globeRadius: number;
};

type Point3 = [number, number, number];

const ORBIT_ROTATION: [number, number, number] = [0.8, 0.2, 0.6];
const SEGMENT_COUNT = 144;

function setLineOpacity(ref: React.RefObject<any>, opacity: number) {
  if (!ref.current) return;

  const material = ref.current.material as THREE.Material | THREE.Material[];

  if (Array.isArray(material)) {
    material.forEach((mat) => {
      mat.opacity = opacity;
      mat.transparent = true;
    });
  } else {
    material.opacity = opacity;
    material.transparent = true;
  }
}

function OrbitSegment({
  start,
  end,
  orbitRadius,
}: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  orbitRadius: number;
}) {
  const coreRef = useRef<any>(null);
  const glowRef = useRef<any>(null);
  const { camera } = useThree();

  const points: Point3[] = [
    [start.x, start.y, start.z],
    [end.x, end.y, end.z],
  ];

  const midpoint = useMemo(() => {
    return start.clone().add(end).multiplyScalar(0.5);
  }, [start, end]);

  useFrame(() => {
    const cameraDistanceFromCenter = camera.position.length();
    const segmentDistanceFromCamera = camera.position.distanceTo(midpoint);

    const closestPossibleDistance = Math.max(
      0.001,
      cameraDistanceFromCenter - orbitRadius
    );

    const farthestPossibleDistance = cameraDistanceFromCenter + orbitRadius;

    const depthAmount = THREE.MathUtils.clamp(
      (segmentDistanceFromCamera - closestPossibleDistance) /
        (farthestPossibleDistance - closestPossibleDistance),
      0,
      1
    );

    const coreOpacity = THREE.MathUtils.lerp(0.95, 0.12, depthAmount);
    const glowOpacity = THREE.MathUtils.lerp(0.2, 0.03, depthAmount);

    setLineOpacity(coreRef, coreOpacity);
    setLineOpacity(glowRef, glowOpacity);
  });

  return (
    <>
      {/* Glow layer */}
      <Line
        ref={glowRef}
        points={points}
        color="#00ffff"
        lineWidth={5}
        transparent
        opacity={0.2}
        depthWrite={false}
      />

      {/* Core layer */}
      <Line
        ref={coreRef}
        points={points}
        color="#00ffff"
        lineWidth={2}
        transparent
        opacity={0.95}
        depthWrite={false}
      />
    </>
  );
}

export default function OrbitLine({ globeRadius }: OrbitLineProps) {
  const orbitRadius = globeRadius * 1.45;

  const segments = useMemo(() => {
    const rotation = new THREE.Euler(...ORBIT_ROTATION);
    const orbitSegments: { start: THREE.Vector3; end: THREE.Vector3 }[] = [];

    for (let i = 0; i < SEGMENT_COUNT; i++) {
      const angleA = (i / SEGMENT_COUNT) * Math.PI * 2;
      const angleB = ((i + 1) / SEGMENT_COUNT) * Math.PI * 2;

      const start = new THREE.Vector3(
        Math.cos(angleA) * orbitRadius,
        0,
        Math.sin(angleA) * orbitRadius
      ).applyEuler(rotation);

      const end = new THREE.Vector3(
        Math.cos(angleB) * orbitRadius,
        0,
        Math.sin(angleB) * orbitRadius
      ).applyEuler(rotation);

      orbitSegments.push({ start, end });
    }

    return orbitSegments;
  }, [orbitRadius]);

  return (
    <>
      {segments.map((segment, index) => (
        <OrbitSegment
          key={index}
          start={segment.start}
          end={segment.end}
          orbitRadius={orbitRadius}
        />
      ))}
    </>
  );
}