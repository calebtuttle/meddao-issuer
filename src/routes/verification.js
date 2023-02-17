import express from "express";
import { handlePost, handleGetCredentials } from "../services/verification.js";

const router = express.Router();

router.post("/", handlePost);
router.get("/credentials", handleGetCredentials);

export default router;
