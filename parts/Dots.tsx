"use client";

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getSatPos } from '@/logic/Utils';
import { useSats } from '@/logic/State';

export function Dots() {
    const mesh = useRef<THREE.InstancedMesh>(null);
    const { sats, setSats, opt, setSel } = useSats();

    const obj = useMemo(() => new THREE.Object3D(), []);

    useEffect(() => {
        const ctrl = new AbortController();
        const url = `/api/s?category=${opt.cat}${opt.search ? `&q=${opt.search}` : ''}`;

        fetch(url, { signal: ctrl.signal })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setSats(data.slice(0, 2000));
                }
            })
            .catch(err => {
                if (err.name !== 'AbortError') {
                    console.error('dots err:', err);
                }
            });

        return () => ctrl.abort();
    }, [opt.cat, opt.search, setSats]);

    const handleDown = (e: any) => {
        e.stopPropagation();
        const id = e.instanceId;
        if (id !== undefined && sats[id]) {
            setSel(sats[id]);
        }
    };

    useFrame(() => {
        if (!mesh.current || sats.length === 0) return;

        const now = new Date();

        sats.forEach((s, i) => {
            const p = getSatPos(s.tle, now);
            if (p) {
                obj.position.set(p.x, p.y, p.z);
                obj.updateMatrix();
                mesh.current?.setMatrixAt(i, obj.matrix);
            }
        });

        mesh.current.instanceMatrix.needsUpdate = true;
    });

    if (sats.length === 0) return null;

    return (
        <instancedMesh
            key={opt.cat}
            ref={mesh}
            args={[undefined, undefined, sats.length]}
            frustumCulled={false}
            onPointerDown={handleDown}
        >
            <sphereGeometry args={[0.012, 8, 8]} />
            <meshBasicMaterial
                color="#9eff6d"
                transparent
                opacity={0.8}
            />
        </instancedMesh>
    );
}
