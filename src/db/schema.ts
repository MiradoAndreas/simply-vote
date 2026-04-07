import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: text("clerk_id").unique().notNull(),
  email: text("email").notNull().unique(),
  imageUrl: text("image_url").notNull(),
  role: text("role").default("student").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const elections = pgTable("elections", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  createdBy: uuid("created_by")
    .references(() => users.id)
    .notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  isPublic: boolean("is_public").default(true).notNull(),
  maxChoices: integer("max_choices").default(1).notNull(), // Nombre max de choix de vote
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Table des options/candidats
export const options = pgTable("options", {
  id: uuid("id").primaryKey().defaultRandom(),
  electionId: uuid("election_id")
    .references(() => elections.id, {
      onDelete: "cascade",
    })
    .notNull(),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Table de votes
export const votes = pgTable(
  "votes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    electionId: uuid("election_id")
      .references(() => elections.id, {
        onDelete: "cascade",
      })
      .notNull(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    optionIds: jsonb("option_ids").$type<string[]>().notNull(), // Pour support multi-choix
    votedAt: timestamp("voted_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueVote: unique().on(table.electionId, table.userId),
  }),
);

// Table des invitations (optionnel, pour les élections privées)
export const invitations = pgTable("invitations", {
  id: uuid("id").primaryKey().defaultRandom(),
  electionId: uuid("election_id")
    .references(() => elections.id, { onDelete: "cascade" })
    .notNull(),
  email: text("email").notNull(),
  token: text("token").unique().notNull(),
  isUsed: boolean("is_used").default(false).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  votes: many(votes),
  elections: many(elections),
}));

export const electionsRelations = relations(elections, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [elections.createdBy],
    references: [users.id],
  }),
  options: many(options),
  votes: many(votes),
  invitations: many(invitations),
}));

export const optionsRelations = relations(options, ({ one }) => ({
  election: one(elections, {
    fields: [options.electionId],
    references: [elections.id],
  }),
}));

export const votesRelations = relations(votes, ({ one }) => ({
  election: one(elections, {
    fields: [votes.electionId],
    references: [elections.id],
  }),
  user: one(users, {
    fields: [votes.userId],
    references: [users.id],
  }),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
  election: one(elections, {
    fields: [invitations.electionId],
    references: [elections.id],
  }),
}));
