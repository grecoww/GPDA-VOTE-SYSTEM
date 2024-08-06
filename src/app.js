import express from "express";
import voteRoute from "./controllers/judge.js";
import adminRoute from "./controllers/admin-panel.js";
import statusRoute from "./controllers/status.js";

import fs from "fs";
import https from "https";

import cors from "cors";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";

import "dotenv/config";

const app = express();
const port = 3000;

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

const PgSession = connectPgSimple(session);

app.use(
  session({
    store: new PgSession(),
    secret: process.env.COOKIE_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 24 * 60 * 1000,
      sameSite: "none",
      secure: true,
    },
  })
);

app.use("/vote", voteRoute);
app.use("/admin", adminRoute);
app.use("/", statusRoute);

app.all("*", (_, res) => {
  res.status(404).json("Rota não encontrada");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.message === "Id do time inválido") {
    res.status(500).json(err.message);
  } else if (err.message.includes("já votou no time")) {
    res.status(500).json(err.message);
  } else if (err.message === "O id do time não existe") {
    res.status(500).json(err.message);
  } else if (err.message === "Aguarde todos os jurados terem votado...") {
    res.status(500).json(err.message);
  } else {
    res.status(500).json("Algo deu errado!");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

https
  .createServer(
    {
      cert: fs.readFileSync("./SSL/code.crt"),
      key: fs.readFileSync("./SSL/code.key"),
    },
    app
  )
  .listen(443, () => {
    console.log(`HTTPS server is running!`);
  });

export default app;
