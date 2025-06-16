import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const newsItems = pgTable("news_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  publishedAt: timestamp("published_at").notNull(),
  isImportant: boolean("is_important").default(false),
});

export const teachers = pgTable("teachers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  department: text("department").notNull(),
  specialization: text("specialization"),
  office: text("office"),
  phone: text("phone"),
  websiteUrl: text("website_url"),
});

export const quickLinks = pgTable("quick_links", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  url: text("url").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  isExternal: boolean("is_external").default(true),
});

export const campusBuildings = pgTable("campus_buildings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  buildingType: text("building_type").notNull(),
  facilities: text("facilities").array(),
});

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  language: text("language").notNull().default("el"),
  newsNotifications: boolean("news_notifications").default(true),
  gradesNotifications: boolean("grades_notifications").default(true),
  eventsNotifications: boolean("events_notifications").default(false),
  darkMode: boolean("dark_mode").default(false),
});

// Insert schemas
export const insertNewsItemSchema = createInsertSchema(newsItems).omit({
  id: true,
});

export const insertTeacherSchema = createInsertSchema(teachers).omit({
  id: true,
});

export const insertQuickLinkSchema = createInsertSchema(quickLinks).omit({
  id: true,
});

export const insertCampusBuildingSchema = createInsertSchema(campusBuildings).omit({
  id: true,
});

export const insertSettingsSchema = createInsertSchema(settings).omit({
  id: true,
});

// Types
export type NewsItem = typeof newsItems.$inferSelect;
export type InsertNewsItem = z.infer<typeof insertNewsItemSchema>;

export type Teacher = typeof teachers.$inferSelect;
export type InsertTeacher = z.infer<typeof insertTeacherSchema>;

export type QuickLink = typeof quickLinks.$inferSelect;
export type InsertQuickLink = z.infer<typeof insertQuickLinkSchema>;

export type CampusBuilding = typeof campusBuildings.$inferSelect;
export type InsertCampusBuilding = z.infer<typeof insertCampusBuildingSchema>;

export type Settings = typeof settings.$inferSelect;
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
