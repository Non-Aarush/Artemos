import React from 'react';

export function Top() {
    return (
        <header className="h-16 glass-panel flex items-center justify-between px-6 z-10 relative">
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold tracking-widest text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] uppercase">
                    Artemos - satellite dashboard
                </h1>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 font-mono">
                    <span className="text-xs text-retro-gray uppercase tracking-wider">System</span>
                    <span className="text-xs text-retro-green font-bold tracking-widest px-2 py-0.5 border border-retro-green bg-[rgba(158,255,109,0.1)] rounded-sm">
                        ONLINE
                    </span>
                </div>
                <div className="h-2 w-2 rounded-full bg-retro-green animate-pulse shadow-[0_0_8px_var(--color-retro-green)]" />
            </div>
        </header>
    );
}
