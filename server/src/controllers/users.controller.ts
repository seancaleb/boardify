import {
  ACCOUNT_DELETED,
  ACCOUNT_NOT_FOUND,
  EMAIL_EXISTS,
  INVALID_PASSWORD,
  PASSWORD_UPDATED,
  PROFILE_AVATAR_REMOVED,
  PROFILE_AVATAR_UPDATED,
} from "@/constants";
import Board from "@/models/board.model";
import Task from "@/models/task.model";
import User from "@/models/user.model";
import { DeleteUserBody, UpdatePasswordBody, UpdateUserBody } from "@/schemas/user.schema";
import cloudinary from "@/utils/cloudinary";
import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";

/**
 * @desc    Get current user
 * @route   GET /api/users/profile
 * @access  PRIVATE
 */
export const getUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { email } = req.user;

    const user = await User.findOne({ email }).select("-password").lean();

    if (!user) {
      return res.status(404).json({ message: ACCOUNT_NOT_FOUND });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update current user
 * @route   PATCH /api/users/profile
 * @access  PRIVATE
 */
export const updateUser = async (
  req: Request<{}, {}, UpdateUserBody>,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { firstName, lastName, email } = req.body;
    const { id } = req.user;

    const user = await User.findById(id).lean();

    if (!user) {
      return res.status(404).json({ message: ACCOUNT_NOT_FOUND });
    }

    const targetUser = await User.findOne({ email });

    if (targetUser) {
      const isPresentEmail = targetUser.id !== id;

      if (isPresentEmail) {
        return res.status(409).json({ message: EMAIL_EXISTS });
      }
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      {
        firstName,
        lastName,
        email,
      },
      { runValidators: true, new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export /**
 * @desc    Delete current user
 * @route   DELETE /api/users/profile
 * @access  PRIVATE
 */
const deleteUser = async (
  req: Request<{}, {}, DeleteUserBody>,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.user;
    const { password } = req.body;

    const user = await User.findById(id).exec();

    // Check if user doesn't exist in the database
    if (!user) {
      return res.status(404).json({ message: ACCOUNT_NOT_FOUND });
    }

    const isPasswordMatch = await user.comparePassword(password);

    // Check if user password doesn't match password from the database
    if (!isPasswordMatch) {
      return res.status(401).json({ message: INVALID_PASSWORD });
    }

    await Board.deleteMany({ userId: id });
    await Task.deleteMany({ userId: id });

    // Delete user
    await user.deleteOne();

    //   Clear cookies
    res.clearCookie("jwt-token", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.clearCookie("jwt-token-refresh", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.json({ message: ACCOUNT_DELETED });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update password of current user
 * @route   PATCH /api/users/profile
 * @access  PRIVATE
 */
export const updatePassword = async (
  req: Request<{}, {}, UpdatePasswordBody>,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.user;
    const { password, newPassword } = req.body;

    const user = await User.findById(id).exec();

    // Check if user doesn't exist in the database
    if (!user) {
      return res.status(404).json({ message: ACCOUNT_NOT_FOUND });
    }

    const isPasswordMatch = await user.comparePassword(password);

    // Check if user password doesn't match password from the database
    if (!isPasswordMatch) {
      return res.status(401).json({ message: INVALID_PASSWORD });
    }

    await User.findOneAndUpdate(
      {
        _id: id,
      },
      {
        password: newPassword,
      },
      {
        runValidators: true,
        new: true,
      }
    );

    res.status(200).json({ message: PASSWORD_UPDATED });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  PRIVATE
 */
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.user;

    const users = await User.aggregate([
      {
        $match: {
          _id: {
            $ne: Types.ObjectId.createFromHexString(id),
          },
        },
      },
      {
        $lookup: {
          from: "boards",
          localField: "_id",
          foreignField: "userId",
          as: "boards",
        },
      },
      {
        $lookup: {
          from: "tasks",
          localField: "_id",
          foreignField: "userId",
          as: "tasks",
        },
      },
      {
        $addFields: {
          totalBoards: {
            $size: "$boards",
          },
          totalTasks: {
            $size: "$tasks",
          },
        },
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          email: 1,
          avatar: 1,
          role: 1,
          userId: 1,
          totalBoards: 1,
          totalTasks: 1,
        },
      },
    ]);

    res.json(users);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload profile avatar
 * @route   POST /api/users/profile/avatar
 * @access  PRIVATE
 */
export const uploadAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.user;

    const user = await User.findById(id).lean();

    if (!user) {
      return res.status(404).json({ message: ACCOUNT_NOT_FOUND });
    }

    if (req.file) {
      cloudinary.uploader.upload(req.file.path, async (err, result) => {
        if (err) {
          console.log(err);

          return res.status(500).json({
            message: "Something went wrong when uploading the image.",
          });
        }

        if (result) {
          const updatedUser = await User.findOneAndUpdate(
            { _id: user._id },
            {
              avatar: result.url,
            },
            { runValidators: true, new: true }
          );

          return res.json({
            message: PROFILE_AVATAR_UPDATED,
            user: updatedUser,
            result,
          });
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete profile avatar
 * @route   DELETE /api/users/profile/avatar
 * @access  PRIVATE
 */
export const deleteAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.user;

    const user = await User.findById(id).lean();

    if (!user) {
      return res.status(404).json({ message: ACCOUNT_NOT_FOUND });
    }

    await User.findOneAndUpdate(
      { _id: user._id },
      {
        avatar: null,
      },
      { runValidators: true, new: true }
    );

    res.json({ message: PROFILE_AVATAR_REMOVED });
  } catch (error) {
    next(error);
  }
};
