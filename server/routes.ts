import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { services, serviceCategories, getServicesByCategory, getServiceById } from "@shared/services";
import { leadOrigin } from "./lead-origin";
import { LEAD_RELAY_PATH, INQUIRY_RELAY_PATH } from "../shared/lead-relay";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // API routes for services (static data - used for SEO and potential future dynamic features)

  for (const form of [
    { path: LEAD_RELAY_PATH, name: "Contact form", label: "contact form" },
    { path: INQUIRY_RELAY_PATH, name: "Service inquiry", label: "service inquiry form" },
  ]) {
  app.options(form.path, leadOrigin);
  app.post(
    form.path,
    leadOrigin,
    express.raw({ type: "multipart/form-data", limit: "32mb" }),
    async (req, res) => {
      // The user explicitly requested one private webhook for all forms and modals.
      const webhookUrl = process.env.TIGON_WEBHOOK_URL;
      if (!webhookUrl) {
        return res.status(503).json({
          error: `The ${form.label} is not configured yet. Please call us instead.`,
        });
      }
      let endpoint: URL;
      try {
        endpoint = new URL(webhookUrl);
      } catch {
        return res.status(503).json({ error: `The ${form.label} is not configured correctly.` });
      }

      if (
        endpoint.protocol !== "https:" ||
        endpoint.username ||
        endpoint.password ||
        endpoint.hostname !== "tigoniot.com" ||
        !endpoint.pathname.startsWith("/hooks/") ||
        endpoint.search ||
        endpoint.hash
      ) {
        return res.status(503).json({ error: `The ${form.label} is not configured correctly.` });
      }

      if (!Buffer.isBuffer(req.body)) {
        return res.status(400).json({ error: "Please submit the form with its photos attached." });
      }

      let submission: FormData;
      try {
        submission = await new Request("https://form.invalid", {
          method: "POST",
          headers: { "Content-Type": req.get("content-type") || "" },
          body: req.body,
        }).formData();
      } catch {
        return res.status(400).json({ error: "We couldn't read the form. Please try again." });
      }

      if (String(submission.get("website") || "").trim()) {
        return res.status(200).json({ ok: true });
      }

      for (const field of ["first_name", "last_name", "email", "phone1"]) {
        const value = submission.get(field);
        if (typeof value !== "string" || !value.trim()) {
          return res.status(400).json({ error: "Please enter your first name, last name, email, and phone." });
        }
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(submission.get("email")))) {
        return res.status(400).json({ error: "Please enter a valid email address." });
      }
      if (String(submission.get("phone1")).replace(/\D/g, "").length < 10) {
        return res.status(400).json({ error: "Enter a phone number with at least 10 digits." });
      }

      for (const name of ["image_1", "image_2", "image_3"]) {
        const file = submission.get(name);
        if (file === null) continue;
        if (typeof file === "string") {
          return res.status(400).json({ error: "Photos must be uploaded as image files." });
        }
        if (!file.name && file.size === 0) {
          submission.delete(name);
          continue;
        }
        if (file.size > 10 * 1024 * 1024) {
          return res.status(400).json({ error: "Each photo must be 10 MB or smaller." });
        }
        if (!/\.(jpe?g|png|gif|webp|heic)$/i.test(file.name)) {
          return res.status(400).json({ error: "Photos must be JPG, PNG, GIF, WebP, or HEIC images." });
        }
      }

      submission.set("form_name", form.name);
      submission.set("website", "");
      submission.delete("user_ip");
      submission.delete("user_agent");

      try {
        const upstream = await fetch(endpoint, {
          method: "POST",
          headers: {
            Origin: "https://villagesgolfcartservices.com",
          },
          body: submission,
          signal: AbortSignal.timeout(20_000),
        });
        const responseText = await upstream.text();
        let result: { ok?: boolean; id?: string; error?: string; message?: string } | null = null;
        try {
          result = JSON.parse(responseText);
        } catch {
          result = null;
        }

        if (upstream.status === 429) {
          return res.status(429).json({
            error: result?.error || result?.message || "Too many attempts. Please wait a minute.",
          });
        }
        if (!upstream.ok || result?.ok !== true) {
          const status = upstream.status >= 400 && upstream.status < 500 ? upstream.status : 502;
          return res.status(status).json({
            error: result?.error || result?.message || "We couldn't send your message. Please try again.",
          });
        }

        return res.status(200).json({ ok: true, id: result.id });
      } catch (error) {
        console.error(
          "TIGON lead submission failed:",
          error instanceof Error ? error.name : "Unknown error",
        );
        return res.status(502).json({
          error: "We couldn't reach our lead system. Please try again or call us.",
        });
      }
    },
  );
  }
  
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
