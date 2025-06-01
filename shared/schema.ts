import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  thumbnail: text("thumbnail"),
  content: jsonb("content").notNull().default({}),
  status: text("status").notNull().default("draft"), // draft, published
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export interface Element {
  id: string;
  type: string;
  name: string;
  visible?: boolean;
  children?: Element[];
  props: Record<string, any>;
  style: Record<string, any>;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  thumbnail?: string;
  status: 'draft' | 'published';
  content: {
    elements: Element[];
    history?: {
      states: {
        elements: Element[];
        selectedElement?: string;
      }[];
      currentIndex: number;
    };
  };
  createdAt: Date;
  updatedAt: Date;
  userId: number;
}

export type InsertProject = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateProject = Partial<Omit<Project, 'id' | 'createdAt'>>;
