import express from "express";

import health from "../models/healthstatus.js";

const statusRoute = express.Router();

statusRoute.get("/status", async (req, res) => {
  const updatedAt = new Date().toISOString();
  const dbHealthInfo = await health.dbHealth();
  res.status(200).json({
    updated_at: updatedAt,
    database: dbHealthInfo,
  });
});

statusRoute.get("/", (req, res) => {
  res.send("Hello World");
});

export default statusRoute;
