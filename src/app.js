import express from "express";
import voteRoute from "./controllers/judge.js";
import adminRoute from "./controllers/admin-panel.js";
import statusRoute from "./controllers/status.js";

import cors from "cors";

import "dotenv/config";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use("/vote", voteRoute);
app.use("/admin", adminRoute);
app.use("/", statusRoute);

app.all("*", (_, res) => {
  res.status(404).send("Rota não encontrada");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.message === "Id do time inválido") {
    res.status(500).send(err.message);
  } else if (err.message.includes("já votou no time")) {
    res.status(500).send(err.message);
  } else if (err.message === "O id do time não existe") {
    res.status(500).send(err.message);
  } else if (err.message === "Aguarde todos os jurados terem votado...") {
    res.status(500).send(err.message);
  } else {
    res.status(500).send("Algo deu errado!");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
