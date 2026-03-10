"use client";

import React from 'react';

export function Bars() {
    return (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-2xl px-8 z-20 pointer-events-auto">
            <div className="glass-panel p-4 border border-retro-gray bg-[rgba(0,0,0,0.6)] backdrop-blur-md">
                <div className="flex items-center justify-between mb-2 text-[10px] text-retro-gray tracking-widest font-mono">
                    <span>// TEMPORAL_PROPAGATION</span>
                    <span className="text-retro-green">REAL_TIME_SYNC [ON]</span>
                </div>

                <div className="flex items-center gap-4">
                    <button className="w-8 h-8 flex items-center justify-center border border-retro-green text-retro-green hover:bg-[rgba(158,255,109,0.1)] transition-colors rounded text-xs">
                        ▶
                    </button>

                    <div className="flex-1 relative h-6 flex items-center">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full h-px bg-retro-gray opacity-30"></div>
                        </div>
                        <input
                            type="range"
                            min="-1440"
                            max="1440"
                            defaultValue="0"
                            className="w-full appearance-none bg-transparent relative z-10 cursor-pointer accent-retro-green"
                        />
                    </div>

                    <div className="text-[10px] font-mono text-white w-24 text-right">
                        T + 00:00:00
                    </div>
                </div>
            </div>
        </div>
    );
}
