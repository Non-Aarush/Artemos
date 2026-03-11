"use client";

import React, { useState } from 'react';
import { useSats } from '@/logic/State';

export function Loc() {
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const { setSatList, setQuery } = useSats();

    const performScan = async () => {
        if (!latitude || !longitude) return;
        setIsScanning(true);
        try {
            const response = await fetch(`/api/s/overhead?lat=${latitude}&lng=${longitude}`);
            const results = await response.json();
            if (Array.isArray(results)) {
                setSatList(results);
                setQuery({ search: '', cat: 'overhead' });
            }
        } catch (err) {
            console.error('scan error:', err);
        } finally {
            setIsScanning(false);
        }
    };

    const getLoc = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setLatitude(pos.coords.latitude.toFixed(4));
                setLongitude(pos.coords.longitude.toFixed(4));
            });
        }
    };

    return (
        <div className="mt-8 border-t border-retro-gray pt-4">
            <div className="grid grid-cols-2 gap-2 mb-2">
                <input
                    type="text"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="LAT"
                    className="bg-[rgba(0,0,0,0.3)] border border-retro-gray text-white p-2 text-[10px] focus:border-retro-green focus:outline-none"
                />
                <input
                    type="text"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="LNG"
                    className="bg-[rgba(0,0,0,0.3)] border border-retro-gray text-white p-2 text-[10px] focus:border-retro-green focus:outline-none"
                />
            </div>

            <div className="flex gap-2">
                <button
                    onClick={performScan}
                    disabled={isScanning}
                    className="flex-1 bg-[rgba(158,255,109,0.1)] border border-retro-green text-retro-green py-2 text-[10px] hover:bg-[rgba(158,255,109,0.2)] transition-colors uppercase tracking-widest disabled:opacity-50"
                >
                    {isScanning ? "SCANNING..." : "SCAN OVERHEAD"}
                </button>
                <button
                    onClick={getLoc}
                    className="w-10 flex items-center justify-center border border-retro-gray text-retro-gray hover:text-white transition-colors"
                >
                    ⊕
                </button>
            </div>
        </div>
    );
}
