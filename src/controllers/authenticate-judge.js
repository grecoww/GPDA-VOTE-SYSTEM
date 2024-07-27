import express from "express";
import auth from "./../models/auth.js";

const voteRoute = express.Router();

//o nome do jurado armazenado no banco de dados sera o primeiro e ultimo nome separados por espaco
voteRoute.post("/verify", auth.CheckJudgeName, async (req, res) => {
  console.log("Judge Authenticated");
  res.sendStatus(201);
});

voteRoute.post("/compute", auth.CheckJudgeName, async (req, res) => {
  console.log("Vote computed");
});

export default voteRoute;
