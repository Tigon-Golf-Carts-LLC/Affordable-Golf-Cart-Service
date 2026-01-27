import type { Express } from "express";
import { createServer, type Server } from "http";
import { services, serviceCategories, getServicesByCategory, getServiceById } from "@shared/services";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // API routes for services (static data - used for SEO and potential future dynamic features)
  
  app.get("/api/services", (_req, res) => {
    res.json(services);
  });

  app.get("/api/services/categories", (_req, res) => {
    res.json(serviceCategories);
  });

  app.get("/api/services/category/:category", (req, res) => {
    const category = decodeURIComponent(req.params.category);
    const categoryServices = getServicesByCategory(category);
    res.json(categoryServices);
  });

  app.get("/api/services/:id", (req, res) => {
    const service = getServiceById(req.params.id);
    if (service) {
      res.json(service);
    } else {
      res.status(404).json({ error: "Service not found" });
    }
  });

  return httpServer;
}
