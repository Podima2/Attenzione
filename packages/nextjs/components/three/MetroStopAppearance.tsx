import React, { useEffect, useMemo, useRef, useState } from "react";
import { type MetroLine, type MetroStop, metroStops } from "../../data/metroData";
import { Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Path corrected for brevity/standardization if needed, but keeping the original path structure when possible

const LINE_COLORS: Record<MetroLine, string> = {
  A: "#FF7F00",
  B: "#0072BC",
  B1: "#00BFFF",
  C: "#00A65E",
};

interface Props {
  onStationClick: (station: MetroStop) => void;
  reportCounts: Record<string, number>;
}

// Type for processed stops
type ProcessedMetroStop = MetroStop & { x: number; z: number };

export default function MetroStopAppearance({ onStationClick, reportCounts }: Props) {
  const height = 150;
  const [hovered, setHovered] = useState<number | null>(null);
  const [clicked, setClicked] = useState<number | null>(null); // 👈 Added state for click
  const { camera } = useThree();
  const labelRefs = useRef<Record<number, THREE.Group>>({});

  // Convert lat/lng to x/z and deduplicate
  const { processedStops, uniqueStops } = useMemo(() => {
    const lats = metroStops.map(s => s.lat);
    const lngs = metroStops.map(s => s.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const PLANE_SIZE = 1000;

    const processed: ProcessedMetroStop[] = metroStops.map(s => ({
      ...s,
      x: ((s.lng - minLng) / (maxLng - minLng) - 0.5) * PLANE_SIZE,
      z: -(0.5 - (s.lat - minLat) / (maxLat - minLat)) * PLANE_SIZE,
    }));

    const uniqueMap = new Map<string, ProcessedMetroStop>();
    processed.forEach(s => {
      if (!uniqueMap.has(s.id)) {
        uniqueMap.set(s.id, s);
      }
    });

    return { processedStops: processed, uniqueStops: Array.from(uniqueMap.values()) };
  }, []);

  // Group stations by line
  const lines = useMemo(() => {
    const grouped: Record<MetroLine, ProcessedMetroStop[]> = { A: [], B: [], B1: [], C: [] };

    for (const s of processedStops) {
      grouped[s.line].push(s);
    }

    for (const lineStops of Object.values(grouped)) {
      lineStops.sort((a, b) => a.order - b.order);
    }

    return grouped;
  }, [processedStops]);

  // Make labels always face the camera
  useFrame(() => {
    Object.values(labelRefs.current).forEach(ref => {
      if (ref) ref.lookAt(camera.position);
    });
  });

  // 👇 Add click-outside handler to clear the clicked state
  useEffect(() => {
    // We attach to window since ThreeJS canvas click events don't bubble
    // and we want any click *not* on a station to clear the click state.
    const handleClickOutside = () => setClicked(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <group>
      {/* Stations as spheres */}
      {uniqueStops.map((s, i) => {
        const reportCount = reportCounts[s.id] || 0;
        const showLabel = hovered === i || clicked === i; // 👈 Show on hover OR click

        return (
          <React.Fragment key={s.id}>
            <mesh
              position={[s.x, height, s.z]}
              scale={showLabel ? 2.5 : 1} // 👈 Use showLabel for scaling
              onPointerOver={e => {
                e.stopPropagation();
                setHovered(i);
              }}
              onPointerOut={() => setHovered(null)}
              onClick={e => {
                e.stopPropagation();
                setClicked(i); // 👈 Set clicked state
                onStationClick(s);
              }}
            >
              <sphereGeometry args={[2.5, 16, 16]} />
              <meshStandardMaterial
                color={LINE_COLORS[s.line]}
                emissive={showLabel ? LINE_COLORS[s.line] : "black"} // 👈 Use showLabel for emissive
                emissiveIntensity={showLabel ? 0.8 : 0} // 👈 Use showLabel for emissive intensity
              />
            </mesh>

            {/* Hover/Click label */}
            {showLabel && (
              <group
                position={[s.x, height + 15, s.z]}
                ref={el => {
                  if (el) labelRefs.current[i] = el;
                }}
              >
                <mesh>
                  <planeGeometry args={[45, 20]} />
                  <meshStandardMaterial color="black" transparent opacity={0.7} />
                </mesh>

                <Text position={[-20, 4, 0.1]} fontSize={3} color="white" anchorX="left" anchorY="middle">
                  {s.name}
                </Text>

                <Text position={[-20, -2, 0.1]} fontSize={2} color="#FFD700" anchorX="left" anchorY="middle">
                  {reportCount} reports
                </Text>
              </group>
            )}
          </React.Fragment>
        );
      })}

      {/* Line connections */}
      {Object.entries(lines).map(([line, stops]) => {
        if (stops.length < 2) return null;
        const points = stops.map(s => new THREE.Vector3(s.x, height, s.z));
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: LINE_COLORS[line as MetroLine], linewidth: 2 });
        return <primitive key={line} object={new THREE.Line(geometry, material)} />;
      })}
    </group>
  );
}
