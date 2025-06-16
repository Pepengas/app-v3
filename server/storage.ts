import { 
  newsItems, 
  teachers, 
  quickLinks, 
  campusBuildings, 
  settings,
  type NewsItem, 
  type InsertNewsItem,
  type Teacher, 
  type InsertTeacher,
  type QuickLink, 
  type InsertQuickLink,
  type CampusBuilding, 
  type InsertCampusBuilding,
  type Settings, 
  type InsertSettings
} from "@shared/schema";
import { db } from "./db";
import { eq, ilike, desc } from "drizzle-orm";

export interface IStorage {
  // News
  getNewsItems(): Promise<NewsItem[]>;
  getNewsItem(id: number): Promise<NewsItem | undefined>;
  createNewsItem(item: InsertNewsItem): Promise<NewsItem>;
  
  // Teachers
  getTeachers(): Promise<Teacher[]>;
  getTeacher(id: number): Promise<Teacher | undefined>;
  searchTeachers(query: string): Promise<Teacher[]>;
  getTeachersByDepartment(department: string): Promise<Teacher[]>;
  createTeacher(teacher: InsertTeacher): Promise<Teacher>;
  
  // Quick Links
  getQuickLinks(): Promise<QuickLink[]>;
  getQuickLink(id: number): Promise<QuickLink | undefined>;
  createQuickLink(link: InsertQuickLink): Promise<QuickLink>;
  
  // Campus Buildings
  getCampusBuildings(): Promise<CampusBuilding[]>;
  getCampusBuilding(id: number): Promise<CampusBuilding | undefined>;
  createCampusBuilding(building: InsertCampusBuilding): Promise<CampusBuilding>;
  
  // Settings
  getSettings(): Promise<Settings>;
  updateSettings(settings: Partial<InsertSettings>): Promise<Settings>;
}

// Removed MemStorage - now using DatabaseStorage only

export class DatabaseStorage implements IStorage {
  async getNewsItems(): Promise<NewsItem[]> {
    return await db.select().from(newsItems).orderBy(desc(newsItems.publishedAt));
  }

  async getNewsItem(id: number): Promise<NewsItem | undefined> {
    const [item] = await db.select().from(newsItems).where(eq(newsItems.id, id));
    return item || undefined;
  }

  async createNewsItem(insertItem: InsertNewsItem): Promise<NewsItem> {
    const [item] = await db
      .insert(newsItems)
      .values(insertItem)
      .returning();
    return item;
  }

  async getTeachers(): Promise<Teacher[]> {
    return await db.select().from(teachers).orderBy(teachers.name);
  }

  async getTeacher(id: number): Promise<Teacher | undefined> {
    const [teacher] = await db.select().from(teachers).where(eq(teachers.id, id));
    return teacher || undefined;
  }

  async searchTeachers(query: string): Promise<Teacher[]> {
    return await db.select().from(teachers)
      .where(
        ilike(teachers.name, `%${query}%`)
      )
      .orderBy(teachers.name);
  }

  async getTeachersByDepartment(department: string): Promise<Teacher[]> {
    return await db.select().from(teachers)
      .where(eq(teachers.department, department))
      .orderBy(teachers.name);
  }

  async createTeacher(insertTeacher: InsertTeacher): Promise<Teacher> {
    const [teacher] = await db
      .insert(teachers)
      .values(insertTeacher)
      .returning();
    return teacher;
  }

  async getQuickLinks(): Promise<QuickLink[]> {
    return await db.select().from(quickLinks);
  }

  async getQuickLink(id: number): Promise<QuickLink | undefined> {
    const [link] = await db.select().from(quickLinks).where(eq(quickLinks.id, id));
    return link || undefined;
  }

  async createQuickLink(insertLink: InsertQuickLink): Promise<QuickLink> {
    const [link] = await db
      .insert(quickLinks)
      .values(insertLink)
      .returning();
    return link;
  }

  async getCampusBuildings(): Promise<CampusBuilding[]> {
    return await db.select().from(campusBuildings);
  }

  async getCampusBuilding(id: number): Promise<CampusBuilding | undefined> {
    const [building] = await db.select().from(campusBuildings).where(eq(campusBuildings.id, id));
    return building || undefined;
  }

  async createCampusBuilding(insertBuilding: InsertCampusBuilding): Promise<CampusBuilding> {
    const [building] = await db
      .insert(campusBuildings)
      .values(insertBuilding)
      .returning();
    return building;
  }

  async getSettings(): Promise<Settings> {
    const [settingsRecord] = await db.select().from(settings).limit(1);
    
    if (!settingsRecord) {
      // Create default settings if none exist
      const [newSettings] = await db
        .insert(settings)
        .values({
          language: "el",
          newsNotifications: true,
          gradesNotifications: true,
          eventsNotifications: false,
          darkMode: false,
        })
        .returning();
      return newSettings;
    }
    
    return settingsRecord;
  }

  async updateSettings(updateSettings: Partial<InsertSettings>): Promise<Settings> {
    const currentSettings = await this.getSettings();
    
    const [updatedSettings] = await db
      .update(settings)
      .set(updateSettings)
      .where(eq(settings.id, currentSettings.id))
      .returning();
    
    return updatedSettings;
  }
}

export const storage = new DatabaseStorage();
