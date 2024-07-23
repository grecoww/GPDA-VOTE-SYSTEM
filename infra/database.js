import pkg from "pg";
const { Client } = pkg;

async function query(queryObject) {
  let client;
  try {
    client = await getNewCLient();
    const res = await client.query(queryObject);
    return res;
  } catch (err) {
    throw err;
  } finally {
    try {
      await client.end();
    } catch (err) {
      console.error(err);
    }
  }
}

async function getNewCLient() {
  const client = new Client({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
  });

  await client.connect();
  return client;
}

function getSSLValues() {
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
    };
  }

  return process.env.NODE_ENV === "production" ? true : false;
}

export default Object.freeze({
  query,
  getNewCLient,
});
