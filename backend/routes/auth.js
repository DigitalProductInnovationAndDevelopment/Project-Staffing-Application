import express from "express";
import { registerController, loginController, logoutController } from "../controllers/auth.js";

const router = express.Router();

// CREATE
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", logoutController);

// READ
// UPDATE
// DELETE

export default router;
