import express from "express";
import auth from "../models/auth.js";
import admin from "../models/admin.js";
import view from "../models/view-vote.js";
import vote from "../models/compute-vote.js";

const adminRoute = express.Router();

adminRoute.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const match = await auth.AuthenticateAdmin(username, password);

    if (match) {
      req.session.username = username;
      res.status(200).send("Administrador autenticado com sucesso");
    } else {
      res.status(403).send("Administrador não foi autenticado");
    }
  } catch (error) {
    next(error);
  }
});

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
    const force = req.query.force === "true"
    const response = await view.VoteResult(force) //return the average points of each team (only works if all judges have voted, unless it have force=true)
    res.status(201).json(response)
  } catch (error) {
    next(error)
  }
})

//prettier-ignore
adminRoute.get("/judges", auth.CheckAdminCredentials, async (req, res, next) => {
  try {
    const response = await view.JudgesVotes(); //return where the judges have voted
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

adminRoute.get("/teams", auth.CheckAdminCredentials, async (req, res, next) => {
  try {
    const response = await view.Teams(); //return where the judges have voted
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

//prettier-ignore
adminRoute.post("/uncompute/:teamid", auth.CheckAdminCredentials, async (req, res, next) => {
  try{
    const judgeName = req.body.name
    const teamId = req.params.teamid

    if (!Number.isInteger(Number(teamId))) {
    throw new Error("Id do time inválido");
    }

    const team = await auth.GetTeamById(teamId);

    await vote.UncomputeVote(judgeName, teamId)
    console.log("Vote deleted")
    res.status(201).send(`Voto de ${judgeName} para o time ${team} foi removido com sucesso`)
  }
  catch(error) {
    next(error)
  }
})

export default adminRoute;
