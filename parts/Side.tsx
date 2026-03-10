import React from 'react';
import { useSats } from '@/logic/State';
import { GroupsList } from '@/logic/Data';
import { Loc } from '@/parts/Loc';

export function Side() {
    const { opt, setOpt } = useSats();

    return (
        <aside className="w-64 glass-panel h-full flex flex-col p-4 z-10 relative">
            <nav className="flex flex-col gap-2 overflow-y-auto pr-2">
                {GroupsList.map((g) => (
                    <button
                        key={g.id}
                        onClick={() => setOpt({ ...opt, cat: g.id })}
                        className={`text-left px-4 py-3 rounded text-sm transition-all duration-200 border ${opt.cat === g.id
                            ? "bg-[rgba(158,255,109,0.1)] border-retro-green text-retro-green shadow-[0_0_10px_rgba(158,255,109,0.2)]"
                            : "border-transparent text-gray-400 hover:text-white hover:border-retro-gray hover:bg-[rgba(255,255,255,0.05)]"
                            }`}
                    >
                        {g.name.toUpperCase()}
                    </button>
                ))}
            </nav>


            <Loc />
        </aside>
    );
}
