import { BOARD_CREATED, BOARD_DELETED, BOARD_NOT_FOUND, FORBIDDEN } from "@/constants";
import Board from "@/models/board.model";
import Task from "@/models/task.model";
import { BoardIdParams, CreateBoardBody, UpdateBoardBody } from "@/schemas/board.schema";
import { NextFunction, Request, Response } from "express";
import _ from "lodash";

/**
 * @desc    Get all boards
 * @route   GET /api/boards
 * @access  PRIVATE
 */
export const getAllBoards = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.user;

    const boards = await Board.find({ userId: id });

    res.json(boards);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new board
 * @route   POST /api/boards
 * @access  PRIVATE
 */
export const createBoard = async (
  req: Request<{}, {}, CreateBoardBody>,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.user;

    await Board.create({ ...req.body, userId: id });

    res.status(201).json({ message: BOARD_CREATED });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a board by ID
 * @route   GET /api/boards/:boardId
 * @access  PRIVATE
 */
export const getBoard = async (
  req: Request<BoardIdParams>,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.user;
    const { boardId } = req.params;

    const board = await Board.findOne({ boardId });

    if (!board) {
      return res.status(404).json({ message: BOARD_NOT_FOUND });
    }

    const boardUserIdString = _.toString(board.userId);
    const userIdString = _.toString(id);

    if (boardUserIdString !== userIdString) {
      return res.status(401).json({ message: FORBIDDEN });
    }

    res.json(board);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a board
 * @route   PATCH /api/boards/:boardId
 * @access  PRIVATE
 */
export const updateBoard = async (
  req: Request<BoardIdParams, {}, UpdateBoardBody>,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.user;
    const { boardId } = req.params;

    const board = await Board.findOne({ boardId });

    if (!board) {
      return res.status(404).json({ message: BOARD_NOT_FOUND });
    }

    const boardUserIdString = _.toString(board.userId);
    const userIdString = _.toString(id);

    if (boardUserIdString !== userIdString) {
      return res.status(401).json({ message: FORBIDDEN });
    }

    const updatedBoard = await Board.findOneAndUpdate(
      { _id: board._id },
      {
        ...req.body,
      },
      { runValidators: true, new: true }
    );

    res.json(updatedBoard);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a board
 * @route   DELETE /api/boards/:boardId
 * @access  PRIVATE
 */
export const deleteBoard = async (
  req: Request<BoardIdParams>,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.user;
    const { boardId } = req.params;

    const board = await Board.findOne({ boardId }).exec();

    if (!board) {
      return res.status(404).json({ message: BOARD_NOT_FOUND });
    }

    const boardUserIdString = _.toString(board.userId);
    const userIdString = _.toString(id);

    if (boardUserIdString !== userIdString) {
      return res.status(401).json({ message: FORBIDDEN });
    }

    await board.deleteOne();
    await Task.deleteMany({ userId: id, boardId: board._id });

    res.json({ message: BOARD_DELETED });
  } catch (error) {
    next(error);
  }
};
