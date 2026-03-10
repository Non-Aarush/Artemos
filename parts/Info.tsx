import React from 'react';
import { useSats } from '@/logic/State';

export function Info() {
    const { sel, opt, setOpt } = useSats();

    return (
        <aside className="w-80 glass-panel h-full flex flex-col p-4 z-10 relative">
            <div className="mb-4 text-xs text-retro-gray tracking-widest border-b border-retro-gray pb-2 flex justify-end">
                <span className={sel ? "text-retro-green" : "text-gray-500"}>
                    [{sel ? "LOCKED" : "NO_TARGET"}]
                </span>
            </div>

            {sel ? (
                <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                    <div className="border border-retro-green bg-[rgba(158,255,109,0.05)] p-3 rounded">
                        <h3 className="text-retro-green font-bold text-lg leading-tight uppercase mb-1">
                            {sel.name}
                        </h3>
                        <p className="text-xs text-retro-gray">NORAD_ID: {sel.id}</p>
                    </div>

                    <div className="space-y-2 text-sm font-mono">
                        <div className="flex justify-between border-b border-retro-panel-light pb-1">
                            <span className="text-retro-gray">V_VELOCITY</span>
                            <span className="text-white">7.67 KM/S</span>
                        </div>
                        <div className="flex justify-between border-b border-retro-panel-light pb-1">
                            <span className="text-retro-gray">H_ALTITUDE</span>
                            <span className="text-white">408.2 KM</span>
                        </div>
                        <div className="flex justify-between border-b border-retro-panel-light pb-1">
                            <span className="text-retro-gray">O_INC</span>
                            <span className="text-white">51.64°</span>
                        </div>
                        <div className="flex justify-between border-b border-retro-panel-light pb-1">
                            <span className="text-retro-gray">CAT_TYPE</span>
                            <span className="text-white">{sel.type.toUpperCase()}</span>
                        </div>
                    </div>

                    <div className="p-3 border border-retro-gray rounded text-xs text-gray-400 bg-[rgba(255,255,255,0.02)]">
                        <p className="mb-2 tracking-widest text-retro-gray">// RAW_TLE_DATA</p>
                        <p className="break-all leading-relaxed opacity-60">
                            {sel.tle.line1}<br />
                            {sel.tle.line2}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-retro-gray border border-dashed border-retro-gray rounded p-4">
                    <p className="mb-2 text-xs">SELECT A SATELLITE TO VIEW TELEMETRY</p>
                    <div className="w-8 h-8 rounded-full border border-retro-gray flex items-center justify-center animate-[spin_4s_linear_infinite]">
                        +
                    </div>
                </div>
            )}

            <div className="mt-4 pt-4 border-t border-retro-gray">
                <div className="relative">
                    <input
                        type="text"
                        value={opt.search}
                        onChange={(e) => setOpt({ ...opt, search: e.target.value })}
                        placeholder="SEARCH NAME..."
                        className="w-full bg-[rgba(0,0,0,0.5)] border border-retro-gray text-white p-2 text-sm focus:outline-none focus:border-retro-green font-mono placeholder-retro-gray transition-colors"
                    />
                    <div className="absolute right-2 top-2 w-2 h-4 bg-retro-green animate-[pulse_1s_infinite]"></div>
                </div>
            </div>
        </aside>
    );
}
