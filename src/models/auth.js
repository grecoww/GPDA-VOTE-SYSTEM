import database from "../../infra/database.js";

export async function CheckJudgeName(req, res, next) {
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

export default Object.freeze({
  CheckJudgeName,
});
