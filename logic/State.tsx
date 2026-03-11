
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import * as satellite from 'satellite.js';

import type { SatInfo } from './AppTypes';
export type { TleData, Coords, SatInfo, Groups } from './AppTypes';


interface AppState {
    satList: SatInfo[];
    setSatList: (list: SatInfo[]) => void;
    focusSat: SatInfo | null;
    setFocusSat: (s: SatInfo | null) => void;
    query: {
        search: string;
        cat: string;
    };
    setQuery: (q: { search: string; cat: string }) => void;
    hoverSat: SatInfo | null;
    setHoverSat: (sat: SatInfo | null) => void;
}

const SatContext = createContext<AppState | undefined>(undefined);

export function SatProv({ children }: { children: ReactNode }) {
    const [satList, setSatList] = useState<SatInfo[]>([]);
    const [focusSat, setFocusSat] = useState<SatInfo | null>(null);
    const [query, setQuery] = useState({
        search: '',
        cat: 'active'
    });
    const [hoverSat, setHoverSat] = useState<SatInfo | null>(null);

    // reset on cat change
    useEffect(() => {
        setFocusSat(null);
        setHoverSat(null);
        setSatList([]);
    }, [query.cat]);

    return (
        <SatContext.Provider value={{
            satList,
            setSatList,
            focusSat,
            setFocusSat,
            query,
            setQuery,
            hoverSat,
            setHoverSat
        }}>
            {children}
        </SatContext.Provider>
    );
}

export function useSats() {
    const ctx = useContext(SatContext);
    if (ctx === undefined) {
        throw new Error('useSats must be used within SatProv');
    }
    return ctx;
}
