import express from "express";
import { SYNC_USER_TO_SALESFORCE } from "../controllers/salesforce.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/sync", auth, SYNC_USER_TO_SALESFORCE);

export default router;
