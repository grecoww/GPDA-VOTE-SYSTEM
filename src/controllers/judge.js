import express from "express";
import auth from "../models/auth.js";
import vote from "../models/compute-vote.js";

const voteRoute = express.Router();

//o nome do jurado armazenado no banco de dados sera o primeiro e ultimo nome separados por espaco
voteRoute.post("/verify", async (req, res, next) => {
  try {
    const { name } = req.body;

    const match = await auth.AuthenticateJudge(name);

    if (match) {
      req.session.name = name;
      res.status(200).json(`Jurado ${name} autenticado com sucesso`);
    } else {
      res.status(403).json("Jurado não foi autenticado");
    }
  } catch (error) {
    next(error);
  }
});

//prettier-ignore
voteRoute.post("/compute/:teamid", auth.CheckJudgeCredentials, async (req, res, next) => {
  try {
    const votes = req.body;
    const teamId = req.params.teamid;
    const judgeName = req.session.name

    if (!Number.isInteger(Number(teamId))) {
      throw new Error("Id do time inválido");
    }

    //isso aqui verificará se o time existe também
    const team = await auth.GetTeamById(teamId);

    const response = await vote.ComputeVote(votes, judgeName, teamId);
    console.log("Vote computed:");
    console.log(response);

    res.status(201).json(`Voto de ${judgeName} para ${team} foi computado com sucesso`);
  } catch (error) {
    next(error)
  }
});

export default voteRoute;
