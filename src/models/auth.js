import database from "../../infra/database.js";
import utils from "./utils.js";

async function CheckJudgeName(req, res, next) {
  let judgeName;
  if (req.body.name) {
    judgeName = req.body.name;
    const parsedJudgeName = judgeName.toLowerCase();

    const text = "SELECT name FROM judge WHERE name=$1;";
    const values = [parsedJudgeName];
    const query = { text, values };
    const response = await database.query(query);

    if (response.rows[0] === undefined) {
      console.log("Not authenticated");
      res.sendStatus(403);
    } else {
      next();
    }
  } else {
    console.log("Not authenticated");
    res.sendStatus(403);
  }
}

async function SetUpdatedAt(judgeName, teamId) {
  const parsedJudgeName = judgeName.toLowerCase();
  const time = utils.GetCurrentTime();

  const text = "UPDATE judge SET updated_at = $3 WHERE name=$1 AND team_id=$2;";
  const values = [parsedJudgeName, teamId, time];

  const query = { text, values };

  await database.query(query);
}

function GetTeamById() {}

export default Object.freeze({
  CheckJudgeName,
  SetUpdatedAt,
  GetTeamById,
});
