import database from "../../infra/database.js";
import { exec } from "child_process";

async function CreateTables(judgesArray, teamsArray) {
  for (let i = 0; i < judgesArray.length; i++) {
    for (let j = 0; j < teamsArray.length; j++) {
      console.log(judgesArray[i], j + 1);

      const teamId = j + 1;
      const name = judgesArray[i];

      const text = "INSERT INTO judge (team_id, name) values ($1, $2);";
      const values = [teamId, name];
      const query = { text, values };

      await database.query(query);
    }
  }

  for (let i = 0; i < judgesArray.length; i++) {
    console.log(judgesArray[i]);

    const name = judgesArray[i];

    const text = "INSERT INTO vote_control (name) values ($1);";
    const values = [name];
    const query = { text, values };

    await database.query(query);
  }

  for (let i = 0; i < teamsArray.length; i++) {
    console.log(teamsArray[i], i + 1);

    const teamId = i + 1;
    const team = teamsArray[i];

    const text = "INSERT INTO teams (team_id, team_name) values ($1, $2);";
    const values = [teamId, team];
    const query = { text, values };

    await database.query(query);
  }
}

async function CleanDatabase() {
  await database.query("DROP schema public cascade; CREATE schema public;");
}

async function RunMigrations() {
  exec("npm run migration:up");
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

export default Object.freeze({
  CreateTables,
  CleanDatabase,
  RunMigrations,
});
