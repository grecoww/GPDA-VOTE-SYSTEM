import express from "express";
import verificationRoute from "./controllers/verification.js";
import "dotenv/config";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/", verificationRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
