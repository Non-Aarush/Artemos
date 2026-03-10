import { NextResponse } from 'next/server';
import * as satellite from 'satellite.js';
import { GroupsList } from '@/logic/Data';
import { parseTle } from '@/logic/Utils';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const la = parseFloat(searchParams.get('lat') || '0');
    const lo = parseFloat(searchParams.get('lng') || '0');

    try {
        const r = await fetch(GroupsList[0].url);
        const raw = await r.text();
        const list = parseTle(raw);

        const obs = {
            longitude: satellite.degreesToRadians(lo),
            latitude: satellite.degreesToRadians(la),
            height: 0
        };

        const now = new Date();
        const g = satellite.gstime(now);

        const found = list.filter(s => {
            const rec = satellite.twoline2satrec(s.tle.line1, s.tle.line2);
            const p = satellite.propagate(rec, now);
            if (!p || !p.position || typeof p.position === 'boolean') return false;

            const eci = p.position as satellite.EciVec3<number>;
            const ecf = satellite.eciToEcf(eci, g);
            const luk = satellite.ecfToLookAngles(obs, ecf);
            return luk.elevation > 0.1745;
        });

        return NextResponse.json(found.slice(0, 50));
    } catch (e) {
        return NextResponse.json({ err: 'API FAIL' }, { status: 500 });
    }
}
