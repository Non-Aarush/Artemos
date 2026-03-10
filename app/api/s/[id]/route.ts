import { NextResponse } from 'next/server';
import { GroupsList } from '@/logic/Data';
import { parseTle } from '@/logic/Utils';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;
        const r = await fetch(GroupsList[0].url);
        const raw = await r.text();
        const list = parseTle(raw);

        const s = list.find(x => x.id === id);

        if (!s) {
            return NextResponse.json({ err: 'NOT FOUND' }, { status: 404 });
        }

        return NextResponse.json(s);
    } catch (e) {
        return NextResponse.json({ err: 'FAIL' }, { status: 500 });
    }
}
