"use client";

import React, { Suspense, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Globe } from './Globe';
import { Sky } from './Sky';
import { Dots } from './Dots';
import { Ring } from './Ring';
import { useSats } from '@/logic/State';
import { getSatPos } from '@/logic/Utils';

function Marker() {
    const { sel } = useSats();
    const mesh = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (!mesh.current || !sel) return;
        const p = getSatPos(sel.tle);
        if (p) {
            mesh.current.position.set(p.x, p.y, p.z);
        }
    });

    if (!sel) return null;

    return (
        <mesh ref={mesh} raycast={() => null}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshBasicMaterial color="#c7ff99" transparent opacity={0.6} />
            <mesh raycast={() => null}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshBasicMaterial color="#9eff6d" transparent opacity={0.2} />
            </mesh>
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
                    <Sky count={3000} />
                    <Dots />
                    <Ring />
                    <Marker />
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
