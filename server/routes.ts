import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertNewsItemSchema, insertTeacherSchema, insertQuickLinkSchema, insertCampusBuildingSchema, insertSettingsSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // News routes
  app.get("/api/news", async (req, res) => {
    try {
      const news = await storage.getNewsItems();
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news items" });
    }
  });

  app.get("/api/news/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.getNewsItem(id);
      if (!item) {
        return res.status(404).json({ message: "News item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news item" });
    }
  });

  app.post("/api/news", async (req, res) => {
    try {
      const validatedData = insertNewsItemSchema.parse(req.body);
      const item = await storage.createNewsItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ message: "Invalid news item data" });
    }
  });

  // Teachers routes
  app.get("/api/teachers", async (req, res) => {
    try {
      const { search, department } = req.query;
      
      let teachers;
      if (search) {
        teachers = await storage.searchTeachers(search as string);
      } else if (department) {
        teachers = await storage.getTeachersByDepartment(department as string);
      } else {
        teachers = await storage.getTeachers();
      }
      
      res.json(teachers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch teachers" });
    }
  });

  app.get("/api/teachers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const teacher = await storage.getTeacher(id);
      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }
      res.json(teacher);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch teacher" });
    }
  });

  app.post("/api/teachers", async (req, res) => {
    try {
      const validatedData = insertTeacherSchema.parse(req.body);
      const teacher = await storage.createTeacher(validatedData);
      res.status(201).json(teacher);
    } catch (error) {
      res.status(400).json({ message: "Invalid teacher data" });
    }
  });

  // Quick Links routes
  app.get("/api/links", async (req, res) => {
    try {
      const links = await storage.getQuickLinks();
      res.json(links);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quick links" });
    }
  });

  app.post("/api/links", async (req, res) => {
    try {
      const validatedData = insertQuickLinkSchema.parse(req.body);
      const link = await storage.createQuickLink(validatedData);
      res.status(201).json(link);
    } catch (error) {
      res.status(400).json({ message: "Invalid quick link data" });
    }
  });

  // Campus Buildings routes
  app.get("/api/buildings", async (req, res) => {
    try {
      const buildings = await storage.getCampusBuildings();
      res.json(buildings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campus buildings" });
    }
  });

  app.post("/api/buildings", async (req, res) => {
    try {
      const validatedData = insertCampusBuildingSchema.parse(req.body);
      const building = await storage.createCampusBuilding(validatedData);
      res.status(201).json(building);
    } catch (error) {
      res.status(400).json({ message: "Invalid building data" });
    }
  });

  // Settings routes
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.patch("/api/settings", async (req, res) => {
    try {
      const validatedData = insertSettingsSchema.partial().parse(req.body);
      const settings = await storage.updateSettings(validatedData);
      res.json(settings);
    } catch (error) {
      res.status(400).json({ message: "Invalid settings data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
