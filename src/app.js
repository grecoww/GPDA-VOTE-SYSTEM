import express from "express";
import voteRoute from "./controllers/authenticate-judge.js";
import "dotenv/config";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/vote", voteRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
