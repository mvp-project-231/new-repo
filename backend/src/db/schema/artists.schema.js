import { pgTable, uuid, text, date, timestamp } from 'drizzle-orm/pg-core';

export const artists = pgTable('artists', {
    id: uuid('id').primaryKey(),

    email: text('email')
        .notNull()
        .unique(),

    username: text('username')
        .notNull()
        .unique(),

    dateOfBirth: date('date_of_birth').notNull(),

    createdAt: timestamp('created_at')
        .notNull()
        .defaultNow(),

});