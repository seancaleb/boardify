import {
  createTask,
  deleteTask,
  getAllTasks,
  getTask,
  updateTask,
} from "@/controllers/tasks.controller";
import { validateResource, verifyJwt } from "@/middlewares";
import { createTaskSchema, updateTaskSchema } from "@/schemas/task.schema";
import express from "express";

const router = express.Router();

router.use(verifyJwt);

router.get("/", getAllTasks);
router.post("/", validateResource(createTaskSchema), createTask);
router.get("/:taskId", getTask);
router.patch("/:taskId", validateResource(updateTaskSchema), updateTask);
router.delete("/:taskId", deleteTask);

export default router;
