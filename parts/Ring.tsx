"use client";

import React, { useMemo } from 'react';
import * as THREE from 'three';
import * as satellite from 'satellite.js';
import { useSats } from '@/logic/State';
import { eciTo3d } from '@/logic/Utils';

export function Ring() {
    const { sel } = useSats();

    const pts = useMemo(() => {
        if (!sel) return [];

        const rec = satellite.twoline2satrec(sel.tle.line1, sel.tle.line2);
        const list: THREE.Vector3[] = [];
        const now = new Date();

        for (let i = 0; i < 360; i++) {
            const d = new Date(now.getTime() + i * 30 * 1000);
            const p = satellite.propagate(rec, d);

            if (p && p.position && typeof p.position !== 'boolean') {
                const g = satellite.gstime(d);
                const pos = eciTo3d(p.position as satellite.EciVec3<number>, g);
                list.push(new THREE.Vector3(pos.x, pos.y, pos.z));
            }
        }
        return list;
    }, [sel]);

    if (!sel || pts.length < 2) return null;

    return (
        <line>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[new Float32Array(pts.flatMap(p => [p.x, p.y, p.z])), 3]}
                />
            </bufferGeometry>
            <lineBasicMaterial
                color="#c7ff99"
                linewidth={2}
                transparent
                opacity={0.6}
                depthWrite={false}
            />
        </line>
    );
}
