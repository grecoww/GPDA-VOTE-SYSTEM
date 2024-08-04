import express from "express";
import auth from "../models/auth.js";
import admin from "../models/admin.js";

const adminRoute = express.Router();

adminRoute.post("/login", (req, res) => {});

adminRoute.post("/feed", auth.CheckAdminCredentials, async (req, res, next) => {
  try {
    await admin.CleanDatabase();
    await admin.RunMigrations();

    let { judges, teams } = req.body;

    await admin.CreateTables(judges, teams);

    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
});

//prettier-ignore
adminRoute.get("/database/clear", auth.CheckAdminCredentials, async (req, res) => {
  await admin.CleanDatabase();
  await admin.RunMigrations()

  res.sendStatus(201)
});

export default adminRoute;
