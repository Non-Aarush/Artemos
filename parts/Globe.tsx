"use client";

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export function Globe() {
    const mesh = useRef<THREE.Mesh>(null);
    const [tex] = useTexture(['/textures/earth_daymap.jpg']);

    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.generateMipmaps = false;

    return (
        <mesh ref={mesh} rotation={[0, 0, 0]} castShadow receiveShadow>
            <sphereGeometry args={[2, 64, 64]} />
            <meshStandardMaterial
                map={tex}
                color="#ffffff"
                roughness={1}
                metalness={0}
            />

            <mesh>
                <sphereGeometry args={[2.05, 64, 64]} />
                <meshBasicMaterial
                    color="#202020"
                    transparent
                    opacity={0.1}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
        </mesh>
    );
}
