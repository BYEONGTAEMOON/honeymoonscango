// Used by the `prisma` CLI (generate / db push / studio) when run standalone,
// outside of Next.js's own env loading — so it loads .env.local itself,
// matching this project's convention (see .env.example).
import { config } from 'dotenv';

config({ path: '.env.local' });

import { defineConfig } from 'prisma/config';

export default defineConfig({
    schema: 'prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations',
    },
    datasource: {
        url: process.env.DATABASE_URL,
    },
});
