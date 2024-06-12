import express from "express";
import { createNewProfileController, getAllProfilesByProjectIdController, getProfileByIdController, updateProfileController, deleteProfileController } from "../controllers/profile.js";

const router = express.Router();

// CREATE
router.post("/:projectId", createNewProfileController);

// READ
router.get("/:projectId/profiles", getAllProfilesByProjectIdController);
router.get("/:projectId/:profileId", getProfileByIdController);

// UPDATE
router.put("/:projectId/:profileId", updateProfileController);

// DELETE
router.delete("/:projectId/:profileId", deleteProfileController);

export default router;
