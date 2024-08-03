import express from "express";
import voteRoute from "./controllers/judge.js";
import "dotenv/config";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/vote", voteRoute);

app.all("*", (_, res) => {
  res.status(404).send("Rota não encontrada");
});

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).send("Algo deu errado!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
