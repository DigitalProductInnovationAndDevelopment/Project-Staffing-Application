import express from "express";
import { loginController, logoutController, verifyEmailController, refreshAccessTokenController } from "../controllers/auth.js";

const router = express.Router();

// CREATE
router.post("/login", loginController);
router.post("/logout", logoutController);
router.post("/verifyAccount/:token", verifyEmailController);

// READ
router.get("/refresh", refreshAccessTokenController);
router.get("/csrf", (req, res) => {
    return res.status(204).json()
});

// UPDATE
// DELETE

export default router;
