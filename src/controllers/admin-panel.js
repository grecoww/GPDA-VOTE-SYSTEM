import express from "express";
import auth from "../models/auth.js";
import admin from "../models/admin.js";
import view from "../models/view-vote.js";

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
adminRoute.get("/vote/result", auth.CheckAdminCredentials, async (req, res, next) => {
  try {
    const response = await view.VoteResult() //return the average points of each team (only works if all judges have voted)
    res.status(201).json(response)
  } catch (error) {
    next(error)
  }
})

adminRoute.get("judges", auth.CheckAdminCredentials, async (req, res, next) => {
  try {
    const response = await view.JudgesVotes(); //return where the judges have voted
  } catch (error) {
    next(error);
  }
});

//prettier-ignore
adminRoute.get("/database/clear", auth.CheckAdminCredentials, async (req, res) => {
  try {
    await admin.CleanDatabase();
    await admin.RunMigrations();
    res.sendStatus(201) 
  } catch (error) {
    next(error)
  }

});

export default adminRoute;
