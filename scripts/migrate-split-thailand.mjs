// One-time data migration: 태국 → 코사무이 + 푸켓 in the saved chatbot_config row.
// Runs in `vercel-build` (the only place DATABASE_URL is available). Idempotent:
// each field is only touched while it still has 태국 and neither replacement
// exists, so after the first deploy every later run is a no-op.
import { pathToFileURL } from 'node:url';

import pg from 'pg';

const PHUKET_SLUGS = new Set(['the-shore-katathani', 'phuket-banyan-tree', 'the-pavilions-phuket']);
const POPULAR_RESORT_COUNTRY = { 'villa-amorita': '코사무이', 'pavilion-samui': '코사무이', 'aira-phuket': '푸켓' };

function isPhuket(resort) {
    return PHUKET_SLUGS.has(resort.slug) || /푸켓|카타/.test(`${resort.name ?? ''} ${resort.description ?? ''}`);
}

export function splitThailand(data) {
    let changed = false;
    const next = { ...data };

    const resorts = data.resortsByDestination;
    if (resorts?.['태국'] && !resorts['코사무이'] && !resorts['푸켓']) {
        const rebuilt = {};
        for (const [key, value] of Object.entries(resorts)) {
            if (key === '태국') {
                rebuilt['코사무이'] = value.filter((r) => !isPhuket(r));
                rebuilt['푸켓'] = value.filter(isPhuket);
            } else {
                rebuilt[key] = value;
            }
        }
        next.resortsByDestination = rebuilt;
        changed = true;
    }

    const destinations = data.destinations;
    if (Array.isArray(destinations) && destinations.includes('태국') && !destinations.includes('코사무이') && !destinations.includes('푸켓')) {
        next.destinations = destinations.flatMap((d) => (d === '태국' ? ['코사무이', '푸켓'] : [d]));
        changed = true;
    }

    if (Array.isArray(data.popularResorts)) {
        const mapped = data.popularResorts.map((p) =>
            p.country === '태국' && POPULAR_RESORT_COUNTRY[p.slug] ? { ...p, country: POPULAR_RESORT_COUNTRY[p.slug] } : p,
        );
        if (mapped.some((p, i) => p !== data.popularResorts[i])) {
            next.popularResorts = mapped;
            changed = true;
        }
    }

    return changed ? next : null;
}

async function main() {
    const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
    if (!connectionString) {
        console.log('[split-thailand] DATABASE_URL not set — skipping');
        return;
    }

    const client = new pg.Client({ connectionString });
    await client.connect();
    try {
        const { rows } = await client.query('SELECT data FROM chatbot_config WHERE id = 1');
        if (rows.length === 0) {
            console.log('[split-thailand] no saved config — code defaults already use 코사무이/푸켓');
            return;
        }

        const migrated = splitThailand(rows[0].data);
        if (!migrated) {
            console.log('[split-thailand] already migrated — nothing to do');
            return;
        }

        await client.query('UPDATE chatbot_config SET data = $1::jsonb, updated_at = now() WHERE id = 1', [JSON.stringify(migrated)]);
        console.log('[split-thailand] migrated saved config: 태국 → 코사무이 + 푸켓');
    } finally {
        await client.end();
    }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    await main();
}
