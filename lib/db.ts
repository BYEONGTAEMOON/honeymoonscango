import { neon } from '@neondatabase/serverless';

function getConnectionString(): string {
    const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
    if (!url) {
        throw new Error(
            'DATABASE_URL (or POSTGRES_URL) is not set. Add a Postgres database (e.g. Vercel Storage → Neon) and set the connection string as an environment variable.',
        );
    }
    return url;
}

export function getSql() {
    return neon(getConnectionString());
}

let schemaReady: Promise<void> | null = null;

export function ensureSchema(): Promise<void> {
    if (!schemaReady) {
        const sql = getSql();
        schemaReady = sql`
            CREATE TABLE IF NOT EXISTS leads (
                id SERIAL PRIMARY KEY,
                created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                month TEXT,
                destination TEXT,
                budget TEXT,
                region TEXT,
                name TEXT,
                phone TEXT,
                selected_resorts TEXT,
                status TEXT NOT NULL DEFAULT '신규',
                memo TEXT
            )
        `.then(() => undefined);
    }
    return schemaReady;
}

export type Lead = {
    id: number;
    created_at: string;
    updated_at: string;
    month: string | null;
    destination: string | null;
    budget: string | null;
    region: string | null;
    name: string | null;
    phone: string | null;
    selected_resorts: string | null;
    status: string;
    memo: string | null;
};

let chatbotConfigSchemaReady: Promise<void> | null = null;

export function ensureChatbotConfigSchema(): Promise<void> {
    if (!chatbotConfigSchemaReady) {
        const sql = getSql();
        chatbotConfigSchemaReady = sql`
            CREATE TABLE IF NOT EXISTS chatbot_config (
                id INTEGER PRIMARY KEY DEFAULT 1,
                data JSONB NOT NULL,
                updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                CONSTRAINT chatbot_config_single_row CHECK (id = 1)
            )
        `.then(() => undefined);
    }
    return chatbotConfigSchemaReady;
}
