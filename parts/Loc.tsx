"use client";

import React, { useState } from 'react';
import { useSats } from '@/logic/State';

export function Loc() {
    const [la, setLa] = useState('');
    const [lo, setLo] = useState('');
    const [load, setLoad] = useState(false);
    const { setSats, setOpt } = useSats();

    const handle = async () => {
        if (!la || !lo) return;
        setLoad(true);
        try {
            const r = await fetch(`/api/s/overhead?lat=${la}&lng=${lo}`);
            const d = await r.json();
            if (Array.isArray(d)) {
                setSats(d);
                setOpt({ search: '', cat: 'overhead' });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoad(false);
        }
    };

    const getLoc = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setLa(pos.coords.latitude.toFixed(4));
                setLo(pos.coords.longitude.toFixed(4));
            });
        }
    };

    return (
        <div className="mt-8 border-t border-retro-gray pt-4">
            <div className="grid grid-cols-2 gap-2 mb-2">
                <input
                    type="text"
                    value={la}
                    onChange={(e) => setLa(e.target.value)}
                    placeholder="LAT"
                    className="bg-[rgba(0,0,0,0.3)] border border-retro-gray text-white p-2 text-[10px] focus:border-retro-green focus:outline-none"
                />
                <input
                    type="text"
                    value={lo}
                    onChange={(e) => setLo(e.target.value)}
                    placeholder="LNG"
                    className="bg-[rgba(0,0,0,0.3)] border border-retro-gray text-white p-2 text-[10px] focus:border-retro-green focus:outline-none"
                />
            </div>

            <div className="flex gap-2">
                <button
                    onClick={handle}
                    disabled={load}
                    className="flex-1 bg-[rgba(158,255,109,0.1)] border border-retro-green text-retro-green py-2 text-[10px] hover:bg-[rgba(158,255,109,0.2)] transition-colors uppercase tracking-widest disabled:opacity-50"
                >
                    {load ? "SCANNING..." : "SCAN OVERHEAD"}
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
