import express from "express";
import cors from "cors";
import verification from "./routes/verification.js";

const app = express();

var corsOptions = {
  origin: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

app.use("/verification", verification);

app.get("/", (req, res) => {
  console.log(`${new Date().toISOString()} GET /`);
  const routes = ["POST /verification", "GET /verification"];
  res.status(200).json({ routes: routes });
});

app.get("/aws-health", (req, res) => {
  // console.log(`${new Date().toISOString()} GET /aws-health`);
  return res.status(200).json({ healthy: true });
});

export { app };
