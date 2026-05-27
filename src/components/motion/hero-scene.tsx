"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";

function CoreMesh() {
  const ref = useRef<Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.12;
    ref.current.rotation.y = state.clock.elapsedTime * 0.18;
  });

  return (
    <Float speed={1.8} rotationIntensity={0.6} floatIntensity={1.4}>
      <mesh ref={ref} scale={2.4}>
        <icosahedronGeometry args={[1, 64]} />
        <MeshDistortMaterial
          color="#8b7cf8"
          emissive="#4c3d9e"
          emissiveIntensity={0.35}
          roughness={0.12}
          metalness={0.92}
          distort={0.42}
          speed={2.2}
        />
      </mesh>
    </Float>
  );
}

function Ring() {
  const ref = useRef<Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * 0.08;
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 2.2, 0, 0]}>
      <torusGeometry args={[3.2, 0.02, 64, 128]} />
      <meshBasicMaterial color="#c4b5fd" transparent opacity={0.35} />
    </mesh>
  );
}

export function HeroScene() {
  return (
    <Canvas
      className="h-full w-full"
      camera={{ position: [0, 0, 7], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <fog attach="fog" args={["#120f1f", 5, 12]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} color="#f0eeff" />
      <pointLight position={[-4, -2, 3]} intensity={2} color="#a78bfa" />
      <pointLight position={[3, -3, 2]} intensity={1.2} color="#6366f1" />
      <CoreMesh />
      <Ring />
      <Sparkles count={80} scale={8} size={2} speed={0.35} opacity={0.55} color="#e9e4ff" />
    </Canvas>
  );
}
