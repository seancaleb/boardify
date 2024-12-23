import {
  BOARD_NOT_FOUND,
  FORBIDDEN,
  TASK_CREATED,
  TASK_DELETED,
  TASK_NOT_FOUND,
} from "@/constants";
import Board from "@/models/board.model";
import Task from "@/models/task.model";
import { BoardIdQuery, CreateTaskBody, TaskIdParams, UpdateTaskBody } from "@/schemas/task.schema";
import { NextFunction, Request, Response } from "express";
import _ from "lodash";

/**
 * @desc    Get all tasks
 * @route   GET /api/tasks
 * @access  PRIVATE
 */
export const getAllTasks = async (
  req: Request<{}, {}, {}, BoardIdQuery>,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.user;
    const { boardId } = req.query;

    if (boardId) {
      const board = await Board.findOne({ boardId });

      if (!board) {
        return res.status(404).json({ message: BOARD_NOT_FOUND });
      }

      const boardUserIdString = _.toString(board.userId);
      const userIdString = _.toString(id);

      if (boardUserIdString !== userIdString) {
        return res.status(401).json({ message: FORBIDDEN });
      }

      const tasks = await Task.find({ userId: id, boardId: board.id });

      return res.json(tasks);
    }

    const tasks = await Task.find({ userId: id });

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  PRIVATE
 */
export const createTask = async (
  req: Request<{}, {}, CreateTaskBody>,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.user;
    const { boardId } = req.body;

    const board = await Board.findOne({ boardId });

    if (!board) {
      return res.status(404).json({ message: BOARD_NOT_FOUND });
    }

    const boardUserIdString = _.toString(board.userId);
    const userIdString = _.toString(id);

    if (boardUserIdString !== userIdString) {
      return res.status(401).json({ message: FORBIDDEN });
    }

    await Task.create({ ...req.body, userId: id, boardId: board.id });

    res.status(201).json({ message: TASK_CREATED });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a task by ID
 * @route   GET /api/tasks/:taskId
 * @access  PRIVATE
 */
export const getTask = async (
  req: Request<TaskIdParams>,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.user;
    const { taskId } = req.params;

    const task = await Task.findOne({ taskId });

    if (!task) {
      return res.status(404).json({ message: TASK_NOT_FOUND });
    }

    const taskUserIdString = _.toString(task.userId);
    const userIdString = _.toString(id);

    if (taskUserIdString !== userIdString) {
      return res.status(401).json({ message: FORBIDDEN });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a task
 * @route   PATCH /api/tasks/:taskId
 * @access  PRIVATE
 */
export const updateTask = async (
  req: Request<TaskIdParams, {}, UpdateTaskBody>,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.user;
    const { taskId } = req.params;

    const task = await Task.findOne({ taskId });

    if (!task) {
      return res.status(404).json({ message: TASK_NOT_FOUND });
    }

    const taskUserIdString = _.toString(task.userId);
    const userIdString = _.toString(id);

    if (taskUserIdString !== userIdString) {
      return res.status(401).json({ message: FORBIDDEN });
    }

    const updatedTask = await Task.findOneAndUpdate(
      { _id: task._id },
      {
        ...req.body,
      },
      { runValidators: true, new: true }
    );

    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:taskId
 * @access  PRIVATE
 */
export const deleteTask = async (
  req: Request<TaskIdParams>,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.user;
    const { taskId } = req.params;

    const task = await Task.findOne({ taskId }).exec();

    if (!task) {
      return res.status(404).json({ message: TASK_NOT_FOUND });
    }

    const taskUserIdString = _.toString(task.userId);
    const userIdString = _.toString(id);

    if (taskUserIdString !== userIdString) {
      return res.status(401).json({ message: FORBIDDEN });
    }

    await task.deleteOne();

    res.json({ message: TASK_DELETED });
  } catch (error) {
    next(error);
  }
};
