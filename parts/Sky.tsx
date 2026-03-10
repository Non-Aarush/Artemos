"use client";

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Sky({ count = 2000 }) {
    const mesh = useRef<THREE.Points>(null);

    const pos = useMemo(() => {
        const p = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const dist = 10 + Math.random() * 40;
            const t = THREE.MathUtils.randFloatSpread(360);
            const ph = THREE.MathUtils.randFloatSpread(360);
            p[i * 3] = dist * Math.sin(t) * Math.cos(ph);
            p[i * 3 + 1] = dist * Math.sin(t) * Math.sin(ph);
            p[i * 3 + 2] = dist * Math.cos(t);
        }
        return p;
    }, [count]);

    useFrame((_, delta) => {
        if (mesh.current) {
            mesh.current.rotation.y += delta * 0.005;
        }
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[pos, 3]} />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                color="#c7ff99"
                transparent
                opacity={0.4}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}
