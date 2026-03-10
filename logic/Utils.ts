import * as satellite from 'satellite.js';
import { SatInfo, Coords } from './Types';

export const eciTo3d = (posEci: satellite.EciVec3<number>, gmst: number): Coords => {
    const gdPos = satellite.eciToGeodetic(posEci, gmst);
    const { longitude, latitude, height } = gdPos;

    const RADIUS = 6371;
    const scl = 2 / RADIUS;
    const dist = (RADIUS + height) * scl;

    const x = dist * Math.cos(latitude) * Math.cos(longitude);
    const z = dist * Math.cos(latitude) * Math.sin(longitude);
    const y = dist * Math.sin(latitude);

    return { x, y, z };
};

export const getSatPos = (tle: { line1: string; line2: string }, date = new Date()): Coords | null => {
    try {
        const satrec = satellite.twoline2satrec(tle.line1, tle.line2);
        const prop = satellite.propagate(satrec, date);

        if (!prop || !prop.position || typeof prop.position === 'boolean') return null;

        const eci = prop.position as satellite.EciVec3<number>;
        const gmst = satellite.gstime(date);

        return eciTo3d(eci, gmst);
    } catch (e) {
        return null;
    }
};


export const calcStats = (tle: { line1: string; line2: string }) => {
    try {
        const sr = satellite.twoline2satrec(tle.line1, tle.line2);
        const pv = satellite.propagate(sr, new Date());

        if (!pv || !pv.position || typeof pv.position === 'boolean' || !pv.velocity || typeof pv.velocity === 'boolean') {
            return { v: 0, a: 0 };
        }

        const pos = pv.position as satellite.EciVec3<number>;
        const vel = pv.velocity as satellite.EciVec3<number>;
        const g = satellite.gstime(new Date());

        const gd = satellite.eciToGeodetic(pos, g);

        // velocity in km/s
        const v = Math.sqrt(vel.x * vel.x + vel.y * vel.y + vel.z * vel.z);

        return {
            v: v.toFixed(2),
            a: gd.height.toFixed(1)
        };
    } catch (err) {
        return { v: "0.00", a: "0.0" };
    }
}

export const parseTle = (raw: string, type = 'active'): SatInfo[] => {
    const lines = raw.split('\n').filter(l => l.trim().length > 0);
    const list: SatInfo[] = [];

    for (let i = 0; i < lines.length; i += 3) {
        if (i + 2 >= lines.length) break;

        const n = lines[i].trim();
        const l1 = lines[i + 1].trim();
        const l2 = lines[i + 2].trim();
        const id = l1.substring(2, 7).trim();

        list.push({
            id,
            name: n,
            type,
            tle: { name: n, line1: l1, line2: l2 }
        });
    }

    return list;
};
