import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '@/generated/prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Lazy on purpose: throwing only when a query actually runs (not at import
// time) lets every page/route keep its existing "DB not connected yet" fallback
// UI instead of crashing the whole module graph before DATABASE_URL is set.
export function getPrisma(): PrismaClient {
    if (globalForPrisma.prisma) return globalForPrisma.prisma;

    const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
    if (!connectionString) {
        throw new Error(
            'DATABASE_URL (or POSTGRES_URL) is not set. Add a Postgres database (e.g. Vercel Storage → Prisma Postgres) and set the connection string as an environment variable.',
        );
    }

    const adapter = new PrismaPg({ connectionString });
    const client = new PrismaClient({ adapter });

    // Always cache on globalThis: in dev this survives Next's hot-reloads, and
    // in production it lets a warm serverless instance reuse the same
    // connection pool across requests instead of opening a fresh one (and
    // never closing the old one) on every single page navigation.
    globalForPrisma.prisma = client;

    return client;
}
