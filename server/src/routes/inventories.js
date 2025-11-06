import express from "express";
import {
  GET_ALL_INVENTORIES,
  GET_INVENTORY_BY_ID,
  INSERT_INVENTORY,
  DELETE_INVENTORIES_BY_IDS,
  UPDATE_INVENTORY_BY_ID,
  UPDATE_INVENTORY_SETTINGS_BY_ID,
} from "../controllers/inventories.js";
import validate from "../middlewares/validation.js";
import auth from "../middlewares/auth.js";
import inventorySchema from "../schemas/inventory.js";
import inventorySettingsSchema from "../schemas/inventorySettings.js";

const router = express.Router();

router.post("/", validate(inventorySchema), auth, INSERT_INVENTORY);
router.get("/", GET_ALL_INVENTORIES);
router.get("/:id", GET_INVENTORY_BY_ID);
router.put("/:id", auth, UPDATE_INVENTORY_BY_ID);
router.put(
  "/settings/:id",
  validate(inventorySettingsSchema),
  auth,
  UPDATE_INVENTORY_SETTINGS_BY_ID
);
router.delete("/delete", auth, DELETE_INVENTORIES_BY_IDS);

export default router;
