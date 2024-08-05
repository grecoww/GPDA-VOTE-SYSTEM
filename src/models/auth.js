import database from "../../infra/database.js";
import utils from "./utils.js";

async function AuthenticateJudge(judgeName) {
  if (judgeName) {
    const parsedJudgeName = judgeName.toLowerCase();
    const text = "SELECT name FROM vote_control WHERE name=$1;";
    const values = [parsedJudgeName];
    const query = { text, values };
    const response = await database.query(query);
    const parsedResponse = response.rows[0];

    if (parsedResponse === undefined) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
}

async function CheckJudgeCredentials(req, res, next) {
  if (req.session && req.session.name) {
    next();
  } else {
    return res.status(403).send("Sessão não foi autorizada");
  }
}

async function SetUpdatedAt_Judge(judgeName, teamId) {
  const parsedJudgeName = judgeName.toLowerCase();
  const time = utils.GetCurrentTime();

  const text = "UPDATE judge SET updated_at = $3 WHERE name=$1 AND team_id=$2;";
  const values = [parsedJudgeName, teamId, time];
  const query = { text, values };

  await database.query(query);
}

async function SetUpdatedAt_Vote_Control(judgeName) {
  const parsedJudgeName = judgeName.toLowerCase();
  const time = utils.GetCurrentTime();

  const text = "UPDATE vote_control SET updated_at = $2 WHERE name=$1;";
  const values = [parsedJudgeName, time];
  const query = { text, values };

  await database.query(query);
}

async function GetTeamById(teamId) {
  const text = "SELECT team_name FROM teams WHERE team_id=$1;";
  const values = [teamId];
  const query = { text, values };
  const response = await database.query(query);

  if (response.rows[0] === undefined) {
    console.log("O id do time nao existe");
    throw new Error("O id do time não existe");
  }

  const parsedResponse = response.rows[0]["team_name"];
  return parsedResponse;
}

async function AuthenticateAdmin(username, password) {
  const adminUsername = process.env.ADMIN_USER;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (username && password) {
    if (username === adminUsername) {
      if (password === adminPassword) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}

async function CheckAdminCredentials(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    return res.status(403).send("Sessão não foi autorizada");
  }
}

export default Object.freeze({
  AuthenticateJudge,
  CheckJudgeCredentials,
  SetUpdatedAt_Judge,
  SetUpdatedAt_Vote_Control,
  GetTeamById,
  AuthenticateAdmin,
  CheckAdminCredentials,
});
