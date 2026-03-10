"use client";

import dynamic from 'next/dynamic';
import { Top } from '@/parts/Top';
import { Side } from '@/parts/Side';
import { Info } from '@/parts/Info';
import { SatProv } from '@/logic/State';

const View = dynamic(() => import('@/parts/Main'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 z-0 flex items-center justify-center bg-retro-black">
      <div className="text-retro-green font-mono animate-pulse uppercase">
        Initializing...
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <SatProv>
      <main className="h-screen w-screen overflow-hidden flex flex-col bg-grid-pattern relative">
        <View />
        <Top />
        <div className="flex-1 flex overflow-hidden p-4 gap-4 pointer-events-none relative z-10">
          <div className="pointer-events-auto h-full hidden lg:block">
            <Side />
          </div>
          <div className="flex-1 overflow-hidden relative" />
          <div className="pointer-events-auto h-full hidden xl:block">
            <Info />
          </div>
        </div>
      </main>
    </SatProv>
  );
}
