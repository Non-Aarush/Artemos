"use client";

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getSatPos } from '@/logic/Utils';
import { useSats } from '@/logic/State';
import { subgroupShuffleDown } from 'three/tsl';

export function Dots() {
    const mainMesh = useRef<THREE.InstancedMesh>(null!);
    const targetMesh = useRef<THREE.InstancedMesh>(null!);

    const { satList, setSatList, query, setFocusSat, setHoverSat } = useSats();
    const tempObj = useMemo(() => new THREE.Object3D(), []);

    useEffect(() => {
        const controller = new AbortController();
        const apiPath = `/api/s?category=${query.cat}${query.search ? `&q=${query.search}` : ''}`;

        fetch(apiPath, { signal: controller.signal })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setSatList(data.slice(0, 2000));
                }
            })
            .catch(err => {
                if (err.name !== 'AbortError') console.error('fetch error:', err);
            });

        return () => controller.abort();
    }, [query.cat, query.search, setSatList]);

    const onPointClick = (e: any) => {
        e.stopPropagation();
        const instanceId = e.instanceId;
        if (instanceId !== undefined && satList[instanceId]) {
            setFocusSat(satList[instanceId]);
        }
    };

    const onPointHover = (e: any) => {
        e.stopPropagation();
        const instanceId = e.instanceId;
        if (instanceId !== undefined && satList[instanceId]) {
            setHoverSat(satList[instanceId]);
            document.body.style.cursor = 'pointer';
        }
    };

    const onPointOut = () => {
        setHoverSat(null);
        document.body.style.cursor = 'auto';
    };

    useFrame(() => {
        if (!mainMesh.current || !targetMesh.current || satList.length === 0) return;

        const time = new Date();
        satList.forEach((sat, i) => {
            const p = getSatPos(sat.tle, time);
            if (p) {
                tempObj.position.set(p.x, p.y, p.z);
                tempObj.updateMatrix();
                mainMesh.current.setMatrixAt(i, tempObj.matrix);
                targetMesh.current.setMatrixAt(i, tempObj.matrix);
            }
        });

        mainMesh.current.instanceMatrix.needsUpdate = true;
        targetMesh.current.instanceMatrix.needsUpdate = true;
    });

    if (satList.length === 0) return null;

    return (
        <group>
            <instancedMesh
                ref={mainMesh}
                args={[undefined, undefined, satList.length]}
                frustumCulled={false}
                raycast={() => null}
            >
                <sphereGeometry args={[0.012, 8, 8]} />
                <meshBasicMaterial color="#9eff6d" transparent opacity={0.8} />
            </instancedMesh>

            <instancedMesh
                ref={targetMesh}
                args={[undefined, undefined, satList.length]}
                frustumCulled={false}
                onPointerUp={onPointClick}
                onPointerOver={onPointHover}
                onPointerOut={onPointOut}
            >
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshBasicMaterial
                    transparent
                    opacity={0}
                    depthWrite={false}
                    colorWrite={false}
                />
            </instancedMesh>
        </group>
    );
}

