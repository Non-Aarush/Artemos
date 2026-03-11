import { NextResponse } from 'next/server';
import { GroupsList } from '@/logic/Data';
import { parseTle } from '@/logic/Utils';

let cache: { [key: string]: { data: any, timestamp: number } } = {};
const CACHE_TTL = 3600000; // 1 hour

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('category') || 'active';
    const searchTerm = searchParams.get('q')?.toLowerCase() || '';

    try {
        const groupConfig = GroupsList.find(c => c.id === categoryId) || GroupsList[0];
        let rawData;
        const now = Date.now();

        if (cache[groupConfig.id] && (now - cache[groupConfig.id].timestamp < CACHE_TTL)) {
            rawData = cache[groupConfig.id].data;
        } else {
            const response = await fetch(groupConfig.url);
            rawData = await response.text();
            cache[groupConfig.id] = { data: rawData, timestamp: now };
        }

        let satList = parseTle(rawData, groupConfig.id);

        if (searchTerm) {
            satList = satList.filter(sat =>
                sat.name.toLowerCase().includes(searchTerm) ||
                sat.id.includes(searchTerm)
            );
        }

        return NextResponse.json(satList.slice(0, 2000));
    } catch (err) {
        console.error('api error:', err);
        return NextResponse.json({ error: 'FETCH_ERROR' }, { status: 500 });
    }
}
