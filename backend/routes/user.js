import express from "express";
import { createNewEmployeeController, getAllEmployeesController, getEmployeeByIdController, updateEmployeeController } from "../controllers/user.js";

const router = express.Router();

// CREATE
router.post("/", createNewEmployeeController);

// READ
router.get("/", getAllEmployeesController);
router.get("/:employeeId", getEmployeeByIdController);

// UPDATE
router.put("/:employeeId", updateEmployeeController);

// DELETE

export default router;
