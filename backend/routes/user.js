import express from "express";
import { createNewUserController, getAllUsersController, getUserByIdController, updateUserController } from "../controllers/user.js";

const router = express.Router();

// CREATE
router.post("/", createNewUserController);

// READ
router.get("/", getAllUsersController);
router.get("/:userId", getUserByIdController);

// UPDATE
router.patch("/:userId", updateUserController);

// DELETE

export default router;
