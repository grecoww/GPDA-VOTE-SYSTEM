import database from "../../infra/database.js";
import auth from "./auth.js";

async function ComputeVote(votes, judgeName, teamId) {
  try {
    await CheckIfVoted(judgeName, teamId);

    const parsedJudgeName = judgeName.toLowerCase();
    const text =
      "UPDATE judge SET question_1_1=$1, question_1_2=$2, question_1_3=$3, question_2_1=$4, question_2_2=$5, question_2_3=$6, question_3_1=$7, question_3_2=$8, question_3_3=$9 name=$10 AND team_id=$11 RETURNING *;";
    //prettier-ignore
    const values = [
            votes.q1_1, votes.q1_2, votes.q1_3,
            votes.q2_1, votes.q2_2, votes.q2_3,
            votes.q3_1, votes.q3_2, votes.q3_3,
            parsedJudgeName, teamId
          ];
    const query = { text, values };

    const response = await database.query(query);
    const parsedResponse = response.rows[0];

    await auth.SetUpdatedAt_Judge(judgeName, teamId);
    await MarkAsVoted(judgeName, teamId);

    return parsedResponse;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function UncomputeVote(judgeName, teamId) {
  const parsedJudgeName = judgeName.toLowerCase();
  const text =
    "UPDATE judge SET question_1_1 = 0, question_1_2 = 0, question_1_3 = 0, question_2_1 = 0, question_2_2 = 0, question_2_3 = 0, question_3_1 = 0, question_3_2 = 0, question_3_3 = 0 WHERE name=$1 AND team_id=$2";
  const values = [parsedJudgeName, teamId];
  const query = { text, values };

  await database.query(query);

  await auth.SetUpdatedAt_Judge(judgeName, teamId);
  await MarkAsUnvoted(judgeName, teamId);
}

//

async function MarkAsVoted(judgeName, teamId) {
  const parsedJudgeName = judgeName.toLowerCase();
  const parsedTeamId = `team_${teamId}`;

  const text = `UPDATE vote_control SET ${parsedTeamId}=1 WHERE name=$1;`;
  const values = [parsedJudgeName];
  const query = { text, values };

  await auth.SetUpdatedAt_Vote_Control(judgeName);
  await database.query(query);
}

async function MarkAsUnvoted(judgeName, teamId) {
  const parsedJudgeName = judgeName.toLowerCase();
  const parsedTeamId = `team_${teamId}`;

  const text = `UPDATE vote_control SET ${parsedTeamId}=0 WHERE name=$1;`;
  const values = [parsedJudgeName];
  const query = { text, values };

  const response = await database.query(query);
  await auth.SetUpdatedAt_Vote_Control(judgeName);

  const parsedResponse = response.rows[0];
  return parsedResponse;
}

async function CheckIfVoted(judgeName, teamId) {
  const parsedJudgeName = judgeName.toLowerCase();
  const parsedTeamId = `team_${teamId}`;

  const text = `SELECT ${parsedTeamId} FROM vote_control WHERE name=$1;`;
  const values = [parsedJudgeName];
  const query = { text, values };

  const response = await database.query(query);

  const parsedResponse = response.rows[0];
  if (parsedResponse[parsedTeamId] === 1) {
    throw new Error(`O jurado ${judgeName} já votou no time ${teamId}`);
  }
  return false;
}

export default Object.freeze({
  ComputeVote,
  UncomputeVote,
});
