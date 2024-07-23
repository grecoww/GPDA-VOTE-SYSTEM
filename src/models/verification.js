import database from "../../infra/database.js";

export async function test() {
  const response = await database.query("SELECT 1+1;");
  return response;
}
