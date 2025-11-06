import { v4 as uuidv4 } from "uuid";
import userModel from "../models/users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendVerificationMail from "../utils/sendVerificationEmail.js";
import admin from "../config/firebaseAdmin.js";

const createToken = (email, id) => {
  return jwt.sign({ userEmail: email, userId: id }, process.env.JWT_SECRET, {
    expiresIn: "12h",
  });
};

export const GET_USER_BY_ID = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await userModel.findOne({ id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      user: user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const GET_ALL_USERS = async (req, res) => {
  try {
    const users = await userModel.find();

    return res.status(200).json({
      users: users,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const INSERT_USER = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(req.body.password, salt);
    const userName =
      req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1);

    const user = {
      id: uuidv4(),
      name: userName,
      email: req.body.email,
      emailToken: crypto.randomBytes(64).toString("hex"),
      terms_privacy: req.body.terms_privacy,
      password: passwordHash,
    };

    await sendVerificationMail(user);

    const addUser = new userModel(user);
    const addedUser = await addUser.save();

    const savedUser = await userModel
      .findOne({ id: addedUser.id })
      .select("-password -__v -_id");

    res.status(201).json({
      message: "This user was created",
      user: savedUser,
    });
  } catch (err) {
    console.log("INSERT_USER error:", err);
    const DUPLICATE_ERROR_CODE = 11000;
    if (err.code === DUPLICATE_ERROR_CODE) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const VERIFY_EMAIL = async (req, res) => {
  try {
    const emailToken = req.body.emailToken;
    if (!emailToken) {
      return res
        .status(404)
        .json({ message: "Email verification failed, no token!" });
    }

    const user = await userModel.findOne({ emailToken });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Email verification failed, invalid token!" });
    }

    if (user) {
      user.emailtoken = null;
      user.isVerified = true;

      await user.save();

      const token = createToken(user.email, user.id);

      res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        token,
        isVerified: user?.isVerified,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const FIREBASE_LOGIN = async (req, res) => {
  try {
    const socialToken = req.headers.authorization;
    if (!socialToken) return res.status(401).json({ message: "Missing token" });

    const decoded = await admin.auth().verifyIdToken(socialToken);

    const { uid, email, name } = decoded;

    let user = await userModel.findOne({ email });

    const userRecord = await admin.auth().getUser(uid);
    const emailVerified = userRecord.emailVerified;
    const provider = decoded.firebase.sign_in_provider;

    if (user) {
      user.lastLogin = Date.now();
      await user.save();
    } else {
      user = await userModel.create({
        uid: uid,
        id: uuidv4(),
        email: email,
        name: name || email.split("@")[0],
        isVerified: emailVerified,
        provider: provider,
      });
    }

    const token = createToken(user.email, user.id);

    return res.status(200).json({
      message: "Firebase user logged in successfully",
      user: user,
      jwt: token,
    });
  } catch (err) {
    console.error("Firebase login error:", err);
    return res
      .status(500)
      .json({ message: "Firebase login failed", error: err.message });
  }
};

export const LOGIN_USER = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password",
      });
    }

    const isPasswordMatch = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect email or password",
      });
    }

    user.lastLogin = Date.now();
    await user.save();

    const token = createToken(user.email, user.id);

    return res.status(200).json({
      message: "User logged in successfully",
      jwt: token,
      user: user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const UPDATE_USER_BY_ID = async (req, res) => {
  try {
    const userId = req.params.id;
    const userOption = req.body.userOption;
    const userValue = req.body.userValue;

    const user = await userModel.findOne({ id: userId });

    if (!user) {
      return res.status(404).json({
        message: `User with id ${userId} does not exist`,
      });
    }

    const response = await userModel.findOneAndUpdate(
      { id: userId },
      { $set: { [userOption]: userValue } },
      { new: true }
    );

    res.status(200).json({
      message: "User was updated",
      response: response,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const UPDATE_USERS_BY_IDS = async (req, res) => {
  try {
    const { usersIds, update } = req.body;

    if (!usersIds || !Array.isArray(usersIds) || usersIds.length === 0) {
      return res
        .status(400)
        .json({ message: "usersIds must be a non-empty array" });
    }

    const result = await userModel.updateMany(
      { id: { $in: usersIds } },
      { $set: update }
    );

    res.status(200).json({
      matched: result.matchedCount,
      modified: result.modifiedCount,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const DELETE_USERS_BY_IDS = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "IDs array is required" });
    }

    const result = await userModel.deleteMany({ id: { $in: ids } });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "No users found with the provided IDs" });
    }

    return res.status(200).json({
      message: `Deleted ${result.deletedCount} user(s)`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
