import express from "express";
import auth from "../models/auth.js";
import vote from "../models/compute-vote.js";

const voteRoute = express.Router();

//o nome do jurado armazenado no banco de dados sera o primeiro e ultimo nome separados por espaco
voteRoute.post("/verify", auth.CheckJudgeName, async (req, res) => {
  console.log("Judge Authenticated");
  res.sendStatus(200);
});

voteRoute.post("/compute/:teamid", auth.CheckJudgeName, async (req, res) => {
  const votes = req.body;
  const judgeName = req.body.name;
  const teamId = req.params.teamid;

  await auth.SetUpdatedAt(judgeName, teamId);
  const response = await vote.ComputeVote(votes, judgeName, teamId);
  console.log(response);

  const team = auth.GetTeamById(teamId);
  console.log("Vote computed");
  res.status(201).send(`Voto computado para ${team}: ${response}`);
});

export default voteRoute;
