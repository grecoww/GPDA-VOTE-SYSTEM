import database from "../../infra/database.js";
import auth from "./auth.js";

async function ComputeVote(votes, judgeName, teamId) {
  try {
    await CheckIfVoted(judgeName, teamId);

    const parsedJudgeName = judgeName.toLowerCase();
    const text =
      "UPDATE judge SET question_1_1=$1, question_1_2=$2, question_1_3=$3, question_1_4=$4, question_1_5=$5, question_1_6=$6, question_1_7=$7, question_2_1=$8, question_2_2=$9, question_2_3=$10, question_2_4=$11, question_2_5=$12, question_2_6=$13, question_2_7=$14, question_2_8=$15, question_3_1=$16, question_3_2=$17, question_3_3=$18, question_3_4=$19, question_3_5=$20, question_3_6=$21, question_3_7=$22, question_3_8=$23, question_3_9=$24, question_3_10=$25 WHERE name=$26 AND team_id=$27 RETURNING *;";
    //prettier-ignore
    const values = [
            votes.q1_1, votes.q1_2, votes.q1_3, votes.q1_4, votes.q1_5, votes.q1_6, votes.q1_7,
            votes.q2_1, votes.q2_2, votes.q2_3, votes.q2_4, votes.q2_5, votes.q2_6, votes.q2_7, votes.q2_8,
            votes.q3_1, votes.q3_2, votes.q3_3, votes.q3_4, votes.q3_5, votes.q3_6, votes.q3_7, votes.q3_8, votes.q3_9, votes.q3_10,
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
    "UPDATE judge SET question_1_1 = 0, question_1_2 = 0, question_1_3 = 0, question_1_4 = 0, question_1_5 = 0, question_1_6 = 0, question_1_7 = 0, question_2_1 = 0, question_2_2 = 0, question_2_3 = 0, question_2_4 = 0, question_2_5 = 0, question_2_6 = 0, question_2_7 = 0, question_2_8 = 0, question_3_1 = 0, question_3_2 = 0, question_3_3 = 0, question_3_4 = 0, question_3_5 = 0, question_3_6 = 0, question_3_7 = 0, question_3_8 = 0, question_3_9 = 0, question_3_10 = 0 WHERE name=$1 AND team_id=$2";
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
