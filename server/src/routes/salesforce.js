import express from "express";
import { SYNC_USER_TO_SALES_FORCE } from "../controllers/salesforceController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/sync", auth, SYNC_USER_TO_SALES_FORCE);

export default router;
