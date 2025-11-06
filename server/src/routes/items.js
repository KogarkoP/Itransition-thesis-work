import express from "express";
import {
  GET_All_ITEMS_BY_IDS,
  INSERT_ITEM,
  DELETE_ITEMS_BY_IDS,
} from "../controllers/items.js";
import validate from "../middlewares/validation.js";
import auth from "../middlewares/auth.js";
import itemSchema from "../schemas/items.js";

const router = express.Router();

router.post("/", auth, validate(itemSchema), INSERT_ITEM);
router.post("/inventory-items", GET_All_ITEMS_BY_IDS);
router.delete("/delete", auth, DELETE_ITEMS_BY_IDS);

export default router;
