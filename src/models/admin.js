import database from "../../infra/database.js";
import { join } from "node:path";
import migrationRunner from "node-pg-migrate";

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

  await CreateVoteControlTable(teamsArray);

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
  const dbClient = await database.getNewCLient();

  const migrationData = {
    dbClient: dbClient,
    dryRun: false,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  const migratedMigrations = await migrationRunner(migrationData);
  await dbClient.end();
}

async function CreateVoteControlTable(teamsArray) {
  let idsArray = [];

  for (let i = 0; i < teamsArray.length; i++) {
    idsArray.push(`team_${i + 1} INTEGER DEFAULT 0`);
  }
  const headers = idsArray.join(",\n      ");

  let query = `
    CREATE TABLE vote_control (
      name VARCHAR(100) NOT NULL UNIQUE,
      ${headers},
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await database.query(query);
}

export default Object.freeze({
  CreateTables,
  CleanDatabase,
  RunMigrations,
});
