"use client";

import React, { useMemo } from 'react';
import * as THREE from 'three';
import * as satellite from 'satellite.js';
import { useSats } from '@/logic/State';
import { Line } from '@react-three/drei';

export function Ring() {
    const { focusSat } = useSats();

    const segments = useMemo(() => {
        if (!focusSat) return null;

        const satrec = satellite.twoline2satrec(focusSat.tle.line1, focusSat.tle.line2);
        const now = new Date();
        const catNum = parseInt(focusSat.id) || 1;
        const seed = ((catNum * 2654435761) >>> 0) / 4294967296; // hash to 0-1

        // Vary window: 30 min to 300 min (0.5 to 5 hours)
        const windowMin = 30 + seed * 270;

        const steps = Math.min(400, Math.max(60, Math.floor(windowMin * 2)));
        const startTime = now.getTime() - (windowMin / 2) * 60 * 1000;

        const allSegments: THREE.Vector3[][] = [];
        let current: THREE.Vector3[] = [];
        let prevLon = 0;
        let prevValid = false;

        for (let i = 0; i <= steps; i++) {
            const d = new Date(startTime + (i / steps) * windowMin * 60 * 1000);
            const p = satellite.propagate(satrec, d);

            if (p && p.position && typeof p.position !== 'boolean') {
                const pos = p.position as satellite.EciVec3<number>;
                const gmst = satellite.gstime(d);
                const gd = satellite.eciToGeodetic(pos, gmst);

                const R = 6371;
                const s = 2 / R;
                const dist = (R + gd.height) * s;
                const lon = gd.longitude;

                // Break at date line crossings
                if (prevValid && Math.abs(lon - prevLon) > Math.PI) {
                    if (current.length > 1) allSegments.push(current);
                    current = [];
                }
                prevLon = lon;
                prevValid = true;

                current.push(new THREE.Vector3(
                    dist * Math.cos(gd.latitude) * Math.cos(gd.longitude),
                    dist * Math.sin(gd.latitude),
                    dist * Math.cos(gd.latitude) * Math.sin(gd.longitude)
                ));
            }
        }

        if (current.length > 1) allSegments.push(current);
        return allSegments.length > 0 ? allSegments : null;
    }, [focusSat]);

    if (!focusSat || !segments) return null;

    return (
        <group>
            {segments.map((pts, idx) => (
                <Line
                    key={idx}
                    points={pts}
                    color="#ff8c00"
                    lineWidth={2}
                    transparent
                    opacity={0.8}
                    raycast={() => null}
                />
            ))}
        </group>
    );
}
