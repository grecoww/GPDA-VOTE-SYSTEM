import express from "express";
import { test } from "../models/verification.js";

const verificationRoute = express.Router();

verificationRoute.get("/", async (req, res) => {
  console.log("Verification accessed");
  const response = await test();
  res.send(response.rows[0]);
});

export default verificationRoute;
