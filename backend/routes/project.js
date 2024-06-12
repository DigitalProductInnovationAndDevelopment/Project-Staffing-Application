import express from "express";
import { createNewProjectController, getAllProjectsController, getProjectByIdController, getProjectAssignmentByProjectIdController, updateProjectController, updateProjectAssignmentController } from "../controllers/project.js";

const router = express.Router();

// CREATE
router.post("/", createNewProjectController);

// READ
router.get("/", getAllProjectsController);
router.get("/:projectId", getProjectByIdController);
router.get("/:projectId/assign", getProjectAssignmentByProjectIdController);

// UPDATE
router.put("/:projectId", updateProjectController);
router.put("/:projectId/assign", updateProjectAssignmentController);

// DELETE

export default router;
