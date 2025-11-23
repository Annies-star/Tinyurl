import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql);

export const links = pgTable('link', {
    id: text('id').primaryKey().$defaultFn(() => nanoid()),
    code: text('code').unique().notNull(),
    originalUrl: text('originalUrl').notNull(),
    clicks: integer('clicks').default(0).notNull(),
    lastClicked: timestamp('lastClicked'),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
});

export type Link = typeof links.$inferSelect;
export type NewLink = typeof links.$inferInsert;
