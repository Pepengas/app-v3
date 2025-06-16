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

export class MemStorage implements IStorage {
  private newsItems: Map<number, NewsItem>;
  private teachers: Map<number, Teacher>;
  private quickLinks: Map<number, QuickLink>;
  private campusBuildings: Map<number, CampusBuilding>;
  private settings: Settings;
  private currentId: number;

  constructor() {
    this.newsItems = new Map();
    this.teachers = new Map();
    this.quickLinks = new Map();
    this.campusBuildings = new Map();
    this.currentId = 1;
    
    // Initialize with default settings
    this.settings = {
      id: 1,
      language: "el",
      newsNotifications: true,
      gradesNotifications: true,
      eventsNotifications: false,
      darkMode: false,
    };
    
    this.initializeData();
  }

  private initializeData() {
    // Initialize with some sample data structure - no mock data
    // This would be populated from external APIs in production
  }

  // News methods
  async getNewsItems(): Promise<NewsItem[]> {
    return Array.from(this.newsItems.values()).sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  async getNewsItem(id: number): Promise<NewsItem | undefined> {
    return this.newsItems.get(id);
  }

  async createNewsItem(insertItem: InsertNewsItem): Promise<NewsItem> {
    const id = this.currentId++;
    const item: NewsItem = { ...insertItem, id };
    this.newsItems.set(id, item);
    return item;
  }

  // Teachers methods
  async getTeachers(): Promise<Teacher[]> {
    return Array.from(this.teachers.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  async getTeacher(id: number): Promise<Teacher | undefined> {
    return this.teachers.get(id);
  }

  async searchTeachers(query: string): Promise<Teacher[]> {
    const teachers = Array.from(this.teachers.values());
    const lowercaseQuery = query.toLowerCase();
    return teachers.filter(teacher => 
      teacher.name.toLowerCase().includes(lowercaseQuery) ||
      teacher.department.toLowerCase().includes(lowercaseQuery) ||
      teacher.specialization?.toLowerCase().includes(lowercaseQuery)
    );
  }

  async getTeachersByDepartment(department: string): Promise<Teacher[]> {
    return Array.from(this.teachers.values()).filter(teacher => 
      teacher.department === department
    );
  }

  async createTeacher(insertTeacher: InsertTeacher): Promise<Teacher> {
    const id = this.currentId++;
    const teacher: Teacher = { ...insertTeacher, id };
    this.teachers.set(id, teacher);
    return teacher;
  }

  // Quick Links methods
  async getQuickLinks(): Promise<QuickLink[]> {
    return Array.from(this.quickLinks.values());
  }

  async getQuickLink(id: number): Promise<QuickLink | undefined> {
    return this.quickLinks.get(id);
  }

  async createQuickLink(insertLink: InsertQuickLink): Promise<QuickLink> {
    const id = this.currentId++;
    const link: QuickLink = { ...insertLink, id };
    this.quickLinks.set(id, link);
    return link;
  }

  // Campus Buildings methods
  async getCampusBuildings(): Promise<CampusBuilding[]> {
    return Array.from(this.campusBuildings.values());
  }

  async getCampusBuilding(id: number): Promise<CampusBuilding | undefined> {
    return this.campusBuildings.get(id);
  }

  async createCampusBuilding(insertBuilding: InsertCampusBuilding): Promise<CampusBuilding> {
    const id = this.currentId++;
    const building: CampusBuilding = { ...insertBuilding, id };
    this.campusBuildings.set(id, building);
    return building;
  }

  // Settings methods
  async getSettings(): Promise<Settings> {
    return this.settings;
  }

  async updateSettings(updateSettings: Partial<InsertSettings>): Promise<Settings> {
    this.settings = { ...this.settings, ...updateSettings };
    return this.settings;
  }
}

export const storage = new MemStorage();
