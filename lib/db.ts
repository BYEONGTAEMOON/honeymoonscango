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

type SqlClient = ReturnType<typeof getSql>;

// Caches the CREATE TABLE promise so it only runs once per warm server instance —
// but clears the cache on failure so a transient DB error doesn't permanently
// disable the schema check (and whatever feature depends on it) until restart.
function createSchemaEnsurer(run: (sql: SqlClient) => Promise<unknown>): () => Promise<void> {
    let ready: Promise<void> | null = null;
    return function ensure(): Promise<void> {
        if (!ready) {
            ready = Promise.resolve(run(getSql()))
                .then(() => undefined)
                .catch((error: unknown) => {
                    ready = null;
                    throw error;
                });
        }
        return ready;
    };
}

export const ensureSchema = createSchemaEnsurer(
    (sql) => sql`
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
    `,
);

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

export const ensureChatbotConfigSchema = createSchemaEnsurer(
    (sql) => sql`
        CREATE TABLE IF NOT EXISTS chatbot_config (
            id INTEGER PRIMARY KEY DEFAULT 1,
            data JSONB NOT NULL,
            updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            CONSTRAINT chatbot_config_single_row CHECK (id = 1)
        )
    `,
);

export const ensureAdminAccountSchema = createSchemaEnsurer(
    (sql) => sql`
        CREATE TABLE IF NOT EXISTS admin_account (
            id INTEGER PRIMARY KEY DEFAULT 1,
            username TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            CONSTRAINT admin_account_single_row CHECK (id = 1)
        )
    `,
);

export type AdminAccount = {
    id: number;
    username: string;
    password_hash: string;
    updated_at: string;
};
