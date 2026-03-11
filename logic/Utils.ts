import * as satellite from 'satellite.js';
import { SatInfo, Coords } from './types';

export const eciTo3d = (posEci: satellite.EciVec3<number>, gmst: number): Coords => {
    const geodetic = satellite.eciToGeodetic(posEci, gmst);
    const { longitude, latitude, height } = geodetic;

    const EARTH_RADIUS = 6371;
    const scale = 2 / EARTH_RADIUS;
    const distance = (EARTH_RADIUS + height) * scale;

    const x = distance * Math.cos(latitude) * Math.cos(longitude);
    const z = distance * Math.cos(latitude) * Math.sin(longitude);
    const y = distance * Math.sin(latitude);

    return { x, y, z };
};

const satrecCache = new Map<string, satellite.SatRec>();

const getSatrec = (tle: { line1: string; line2: string }) => {
    const key = tle.line1 + '|' + tle.line2;
    if (satrecCache.has(key)) return satrecCache.get(key)!;

    const satrec = satellite.twoline2satrec(tle.line1, tle.line2);
    satrecCache.set(key, satrec);
    return satrec;
};

export const getSatPos = (tle: { line1: string; line2: string }, date = new Date()): Coords | null => {
    try {
        const satrec = getSatrec(tle);
        const propagation = satellite.propagate(satrec, date);

        if (!propagation || !propagation.position || typeof propagation.position === 'boolean') return null;

        const eciCoords = propagation.position as satellite.EciVec3<number>;
        const gmst = satellite.gstime(date);

        return eciTo3d(eciCoords, gmst);
    } catch (err) {
        return null;
    }
};

export const calcStats = (tle: { line1: string; line2: string }) => {
    try {
        const satrec = getSatrec(tle);
        const posVel = satellite.propagate(satrec, new Date());

        if (!posVel || !posVel.position || typeof posVel.position === 'boolean' || !posVel.velocity || typeof posVel.velocity === 'boolean') {
            return { v: 0, a: 0 };
        }

        const pos = posVel.position as satellite.EciVec3<number>;
        const vel = posVel.velocity as satellite.EciVec3<number>;
        const gmst = satellite.gstime(new Date());

        const geodetic = satellite.eciToGeodetic(pos, gmst);

        // velocity in km/s
        const velocity = Math.sqrt(vel.x * vel.x + vel.y * vel.y + vel.z * vel.z);

        return {
            v: velocity.toFixed(2),
            a: geodetic.height.toFixed(1)
        };
    } catch (err) {
        return { v: "0.00", a: "0.0" };
    }
}

export const parseTle = (raw: string, type = 'active'): SatInfo[] => {
    const lines = raw.split('\n').filter(l => l.trim().length > 0);
    const results: SatInfo[] = [];

    for (let i = 0; i < lines.length; i += 3) {
        if (i + 2 >= lines.length) break;

        const name = lines[i].trim();
        const l1 = lines[i + 1].trim();
        const l2 = lines[i + 2].trim();
        const id = l1.substring(2, 7).trim();

        results.push({
            id,
            name: name,
            type,
            tle: { name: name, line1: l1, line2: l2 }
        });
    }

    return results;
};
