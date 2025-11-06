import express from "express";
import {
  INSERT_USER,
  LOGIN_USER,
  GET_ALL_USERS,
  GET_USER_BY_ID,
  UPDATE_USERS_BY_IDS,
  DELETE_USERS_BY_IDS,
  VERIFY_EMAIL,
  FIREBASE_LOGIN,
  UPDATE_USER_BY_ID,
} from "../controllers/users.js";
import validate from "../middlewares/validation.js";
import auth from "../middlewares/auth.js";
import userSchema from "../schemas/user.js";
import userUpdateSchema from "../schemas/userUpdate.js";
import loginSchema from "../schemas/login.js";

const router = express.Router();

router.get("/", auth, GET_ALL_USERS);
router.get("/:id", auth, GET_USER_BY_ID);
router.put("/bulk-update", auth, UPDATE_USERS_BY_IDS);
router.put("/:id", validate(userUpdateSchema), auth, UPDATE_USER_BY_ID);
router.post("/firebase-login", FIREBASE_LOGIN);
router.post("/verify-email", VERIFY_EMAIL);
router.post("/register", validate(userSchema), INSERT_USER);
router.post("/login", validate(loginSchema), LOGIN_USER);
router.delete("/delete", auth, DELETE_USERS_BY_IDS);

export default router;
