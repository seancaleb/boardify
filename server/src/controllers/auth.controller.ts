import {
  ACCOUNT_CREATED,
  ACCOUNT_NOT_FOUND,
  EMAIL_EXISTS,
  FORBIDDEN,
  INVALID_PASSWORD,
  UNAUTHORIZED,
} from "@/constants";
import User from "@/models/user.model";
import { LoginBody, RegisterBody } from "@/schemas/user.schema";
import config from "config";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

/**
 * @desc    Register
 * @route   POST /api/auth/register
 * @access  PUBLIC
 */
export const register = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { email } = req.body;

    const emailExists = await User.find({ email }).lean();

    if (emailExists.length) {
      return res.status(409).json({ message: EMAIL_EXISTS });
    }

    const DEFAULT_AVATAR = config.get<string>("defaultAvatar");

    await User.create({ ...req.body, avatar: DEFAULT_AVATAR });

    res.status(201).json({ message: ACCOUNT_CREATED });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login
 * @route   POST /api/auth/login
 * @access  PUBLIC
 */
export const login = async (
  req: Request<{}, {}, LoginBody>,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: ACCOUNT_NOT_FOUND });
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: INVALID_PASSWORD });
    }

    const ACCESS_TOKEN = config.get<string>("accessToken");
    const ACCESS_TOKEN_EXPIRES_IN = config.get<string>("accessTokenExpiresIn");

    const accessToken = jwt.sign(
      {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        userId: user.userId,
      },
      ACCESS_TOKEN,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    );

    res.cookie("jwt-token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000,
    });

    const REFRESH_TOKEN = config.get<string>("refreshToken");
    const REFRESH_TOKEN_EXPIRES_IN = config.get<string>("refreshTokenExpiresIn");

    const refreshToken = jwt.sign(
      {
        email: user.email,
      },
      REFRESH_TOKEN,
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
    );

    res.cookie("jwt-token-refresh", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Refresh
 * @route   GET /api/auth/refresh
 * @access  PUBLIC - because token has expired
 */
export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const cookies = req.cookies;

    if (!cookies["jwt-token-refresh"]) {
      return res.status(401).json({ message: UNAUTHORIZED });
    }

    const refreshToken = cookies["jwt-token-refresh"] as string;

    const REFRESH_TOKEN = config.get<string>("refreshToken");

    jwt.verify(refreshToken, REFRESH_TOKEN, async (err: jwt.VerifyErrors | null, decoded) => {
      if (err) {
        return res.status(403).json({ message: FORBIDDEN });
      }

      const { email } = jwt.decode(refreshToken) as { email: string };

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: ACCOUNT_NOT_FOUND });
      }

      const ACCESS_TOKEN = config.get<string>("accessToken");
      const ACCESS_TOKEN_EXPIRES_IN = config.get<string>("accessTokenExpiresIn");

      const accessToken = jwt.sign(
        {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          userId: user.userId,
        },
        ACCESS_TOKEN,
        { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
      );

      res.cookie("jwt-token", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 15 * 60 * 1000,
      });

      res.json({ accessToken });
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout
 * @route   POST /api/auth/logout
 * @access  PUBLIC - just to clear cookies if exist
 */
export const logout = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const cookies = req.cookies;

    if (!cookies["jwt-token-refresh"]) {
      return res.status(401).json({ message: UNAUTHORIZED });
    }

    res.clearCookie("jwt-token", { httpOnly: true, sameSite: "none", secure: true });

    res.clearCookie("jwt-token-refresh", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    return res.json({ message: "Cookies cleared successfully" });
  } catch (error) {
    next(error);
  }
};
