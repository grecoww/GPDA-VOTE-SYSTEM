import database from "../../infra/database.js";

async function dbHealth() {
  const dbVersionResult = await database.query("SHOW server_version;");
  const dbVersion = dbVersionResult.rows[0].server_version;

  const dbName = String(process.env.POSTGRES_DB);
  const dbOpenedConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname=$1",
    values: [dbName],
  });
  const dbOpenedConnections = dbOpenedConnectionsResult.rows[0].count;

  const dbMaxConnectionsResult = await database.query("SHOW max_connections;");
  const dbMaxConnections = dbMaxConnectionsResult.rows[0].max_connections;

  const dbHealthInfo = {
    version: dbVersion,
    max_connections: parseInt(dbMaxConnections),
    opened_connections: dbOpenedConnections,
  };

  return dbHealthInfo;
}

export default Object.freeze({
  dbHealth,
});
