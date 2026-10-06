import type { RequestHandler } from "express";
import { LEAD_RELAY_ORIGIN } from "../shared/lead-relay";

export const leadOrigin: RequestHandler = (req, res, next) => {
  const allowedOrigins = new Set([
    "https://villagesgolfcartservices.com",
    "https://www.villagesgolfcartservices.com",
    LEAD_RELAY_ORIGIN,
    ...(process.env.TIGON_ALLOWED_ORIGINS || "").split(",").map((origin) => origin.trim()).filter(Boolean),
  ]);
  const origin = req.get("origin");
  res.vary("Origin");
  res.setHeader("Cache-Control", "no-store");

  if (origin && allowedOrigins.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else if (process.env.NODE_ENV === "production" || req.method === "OPTIONS") {
    res.status(403).json({ error: "This form can only be submitted from our website." });
    return;
  }

  if (req.method === "OPTIONS") {
    if (req.get("access-control-request-method") !== "POST") {
      res.status(405).json({ error: "Only form submissions are supported." });
      return;
    }
    const headers = (req.get("access-control-request-headers") || "")
      .split(",").map((header) => header.trim().toLowerCase()).filter(Boolean);
    if (headers.some((header) => header !== "content-type")) {
      res.status(403).json({ error: "Unsupported request headers." });
      return;
    }
    res.setHeader("Access-Control-Allow-Methods", "POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.status(204).end();
    return;
  }
  next();
};
