import { NextResponse } from 'next/server';
import { GroupsList } from '@/logic/Data';
import { parseTle } from '@/logic/Utils';

let cache: { [key: string]: { d: any, ts: number } } = {};
const TTL = 3600000;

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const cat = searchParams.get('category') || 'active';
    const q = searchParams.get('q')?.toLowerCase() || '';

    try {
        const conf = GroupsList.find(c => c.id === cat) || GroupsList[0];
        let d;
        const now = Date.now();

        if (cache[conf.id] && (now - cache[conf.id].ts < TTL)) {
            d = cache[conf.id].d;
        } else {
            const r = await fetch(conf.url);
            d = await r.text();
            cache[conf.id] = { d, ts: now };
        }

        let list = parseTle(d, conf.id);
        if (q) {
            list = list.filter(s => s.name.toLowerCase().includes(q) || s.id.includes(q));
        }

        return NextResponse.json(list.slice(0, 2000));
    } catch (e) {
        return NextResponse.json({ err: 'API FAIL' }, { status: 500 });
    }
}
