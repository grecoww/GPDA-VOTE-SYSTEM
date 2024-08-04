import express from "express";
import auth from "../models/auth.js";
import vote from "../models/compute-vote.js";

const voteRoute = express.Router();

//o nome do jurado armazenado no banco de dados sera o primeiro e ultimo nome separados por espaco
voteRoute.post("/verify", auth.CheckJudgeName, async (req, res) => {
  console.log("Judge Authenticated");
  res.sendStatus(200);
});

//prettier-ignore
voteRoute.post("/compute/:teamid", auth.CheckJudgeName, async (req, res, next) => {
  try {
    const votes = req.body;
    const judgeName = req.body.name;
    const teamId = req.params.teamid;

    if (!Number.isInteger(Number(teamId))) {
      throw new Error("Id do time inválido");
    }

    //isso aqui verificará se o time existe também
    const team = await auth.GetTeamById(teamId);

    const response = await vote.ComputeVote(votes, judgeName, teamId);
    console.log("Vote computed:");
    console.log(response);

    res
      .status(201)
      .send(
        `Voto de ${judgeName} para ${team} foi computado com sucesso`
      );
  } catch (error) {
    next(error)
  }
});

export default voteRoute;
