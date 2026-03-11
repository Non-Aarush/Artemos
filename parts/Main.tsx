"use client";

import React, { Suspense, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Globe } from './Globe';
import { Dots } from './Dots';
import { Ring } from './Ring';
import { useSats } from '@/logic/State';
import { getSatPos } from '@/logic/Utils';

function Marker() {
    const { focusSat } = useSats();
    const mesh = useRef<THREE.Mesh>(null!);

    useFrame(() => {
        if (!mesh.current || !focusSat) return;
        const p = getSatPos(focusSat.tle);
        if (p) {
            mesh.current.position.set(p.x, p.y, p.z);
        }
    });

    if (!focusSat) return null;

    return (
        <mesh ref={mesh} raycast={() => null}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshBasicMaterial color="#ff8c00" transparent opacity={0.8} />
            <mesh raycast={() => null}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshBasicMaterial color="#ff8c00" transparent opacity={0.3} />
            </mesh>
        </mesh>
    );
}

function HoverMarker() {
    const { hoverSat } = useSats();
    const mesh = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        if (!mesh.current || !hoverSat) return;
        const p = getSatPos(hoverSat.tle);
        if (p) {
            mesh.current.position.set(p.x, p.y, p.z);
            mesh.current.lookAt(state.camera.position);
        }
    });

    if (!hoverSat) return null;

    return (
        <mesh ref={mesh} raycast={() => null}>
            <ringGeometry args={[0.06, 0.07, 32]} />
            <meshBasicMaterial color="#9eff6d" transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
    );
}

export default function Main() {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas
                shadows={false}
                gl={{ antialias: false, powerPreference: "high-performance" }}
                camera={{ position: [0, 0, 8], fov: 45 }}
            >
                <color attach="background" args={['#000000']} />
                <ambientLight intensity={0.8} />
                <directionalLight
                    position={[5, 3, 5]}
                    intensity={2.0}
                    color="#ffffff"
                />
                <Suspense fallback={null}>
                    <Globe />
                    <Dots />
                    <Ring />
                    <Marker />
                    <HoverMarker />
                </Suspense>
                <OrbitControls
                    enablePan={false}
                    enableZoom={true}
                    minDistance={3}
                    maxDistance={20}
                    rotateSpeed={0.5}
                    zoomSpeed={0.8}
                />
                <EffectComposer>
                    <Bloom
                        luminanceThreshold={0.5}
                        mipmapBlur
                        intensity={1.5}
                    />
                </EffectComposer>
            </Canvas>
        </div>
    );
}
