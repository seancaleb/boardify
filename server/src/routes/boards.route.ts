import {
  createBoard,
  deleteBoard,
  getAllBoards,
  getBoard,
  updateBoard,
} from "@/controllers/boards.controller";
import { validateResource, verifyJwt } from "@/middlewares";
import { createBoardSchema, updateBoardSchema } from "@/schemas/board.schema";
import express from "express";

const router = express.Router();

router.use(verifyJwt);

router.get("/", getAllBoards);
router.post("/", validateResource(createBoardSchema), createBoard);
router.get("/:boardId", getBoard);
router.patch("/:boardId", validateResource(updateBoardSchema), updateBoard);
router.delete("/:boardId", deleteBoard);

export default router;
