import database from "../../infra/database.js";
import auth from "./auth.js";

async function VoteResult(Force) {
  //Force: Boolean
  try {
    if (!Force) {
      await CheckIfAllVoted();
    }
    const teamIds = await GetTeamIds(); //return array of teamIds
    let averageArrays = [];
    let totalVotes = 0;

    const text = "SELECT * FROM judge WHERE team_id=$1";
    for (let id of teamIds) {
      const parsedId = id["team_id"];
      const team = await auth.GetTeamById(parsedId);

      const values = [parsedId];
      const query = { text, values };
      const response = await database.query(query);
      const parsedResponse = response.rows;

      let somatorio = 0;
      let length = 0;

      for (let i = 0; i < parsedResponse.length; i++) {
        for (let key in parsedResponse[i]) {
          if (key.includes("question")) {
            somatorio += Number(parsedResponse[i][key]);
            length += 1;
          }
        }
      }
      const average = somatorio / length;
      const parsedAverage = { [team]: average };
      console.log(`Média de pontos do(a) ${team} -> ${average}`);
      averageArrays.push(parsedAverage);
    }
    return averageArrays;
  } catch (error) {
    throw error;
  }
}

async function JudgesVotes() {
  const query = "SELECT * FROM vote_control";
  const response = await database.query(query);
  const parsedReponse = response.rows;

  const voteControlArray = [];

  for (let judge of parsedReponse) {
    voteControlArray.push(judge);
  }
  return voteControlArray;
}

async function GetTeamIds() {
  const query = "SELECT team_id FROM teams;";
  const response = await database.query(query);
  const parsedResponse = response.rows;
  return parsedResponse;
}

async function CheckIfAllVoted() {
  const query = "SELECT * FROM vote_control;";
  const response = await database.query(query);
  const parsedResponse = response.rows;
  for (let object of parsedResponse) {
    for (let key in object) {
      if (key.includes("team")) {
        if (object[key] === 0) {
          throw new Error(`Aguarde todos os jurados terem votado...`);
        }
      }
    }
  }
}

async function Teams() {
  const query = "SELECT * FROM teams;";
  const response = await database.query(query);
  const parsedResponse = response.rows;
  return parsedResponse;
}

export default Object.freeze({
  VoteResult,
  JudgesVotes,
  Teams,
});
