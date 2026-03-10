"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { SatInfo } from './Types';

interface State {
    sats: SatInfo[];
    setSats: (s: SatInfo[]) => void;
    sel: SatInfo | null;
    setSel: (s: SatInfo | null) => void;
    opt: {
        search: string;
        cat: string;
    };
    setOpt: (f: { search: string; cat: string }) => void;
}

const Ctx = createContext<State | undefined>(undefined);

export function SatProv({ children }: { children: ReactNode }) {
    const [sats, setSats] = useState<SatInfo[]>([]);
    const [sel, setSel] = useState<SatInfo | null>(null);
    const [opt, setOpt] = useState({
        search: '',
        cat: 'active'
    });

    useEffect(() => {
        setSel(null);
        setSats([]);
    }, [opt.cat]);

    return (
        <Ctx.Provider value={{
            sats,
            setSats,
            sel,
            setSel,
            opt,
            setOpt
        }}>
            {children}
        </Ctx.Provider>
    );
}

export function useSats() {
    const c = useContext(Ctx);
    if (c === undefined) {
        throw new Error('useSats must be used within SatProv');
    }
    return c;
}
