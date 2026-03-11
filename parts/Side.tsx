import React from 'react';
import { useSats } from '@/logic/State';
import { GroupsList } from '@/logic/Data';
import { Loc } from '@/parts/Loc';

export function Side() {
    const { query, setQuery } = useSats();

    return (
        <aside className="w-64 glass-panel h-full flex flex-col p-4 z-10 relative">
            <nav className="flex flex-col gap-2 overflow-y-auto pr-2">
                {GroupsList.map((group) => (
                    <button
                        key={group.id}
                        onClick={() => setQuery({ ...query, cat: group.id })}
                        className={`text-left px-4 py-3 rounded text-sm transition-all duration-200 border ${query.cat === group.id
                            ? "bg-[rgba(158,255,109,0.1)] border-retro-green text-retro-green shadow-[0_0_10px_rgba(158,255,109,0.2)]"
                            : "border-transparent text-gray-400 hover:text-white hover:border-retro-gray hover:bg-[rgba(255,255,255,0.05)]"
                            }`}
                    >
                        {group.name.toUpperCase()}
                    </button>
                ))}
            </nav>
            <div className="flex-1" />
            <Loc />
        </aside>
    );
}
