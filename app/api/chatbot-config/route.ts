import { NextResponse } from 'next/server';

import { getScenario } from '@/lib/scenario-store';

export async function GET() {
    const scenario = await getScenario();
    return NextResponse.json({ scenario });
}
