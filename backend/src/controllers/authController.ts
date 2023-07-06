import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { correctPassword } from "../utils/utils";
import { promisify } from "util";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

interface IUser {
  id: string;
  email: string;
  password: string;
  postsIds: string[];
}

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

const createSendToken = (user: IUser, statusCode: number, res: Response) => {
  const token = signToken(user.id);
  const cookieOptions = {
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = "";

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body as IUser;

    const userPresent = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (userPresent) {
      return res
        .status(409)
        .json({ message: "User with email already exists" });
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        password: await bcrypt.hash(password, 12),
      },
    });

    createSendToken(newUser as IUser, 201, res);
  } catch (e: any) {
    res.status(404).json({
      message: e,
    });
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body as IUser;

    // 1) Check if email and password exist
    if (!email || !password) {
      return res.status(404).json({
        message: "Please provide email and password!",
      });
    }
    // 2) Check if user exists && password is correct
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await correctPassword(password, user.password))) {
      return res.status(404).json({
        message: "Incorrect email or password!",
      });
    }

    // 3) If everything ok, send token to client
    createSendToken(user as IUser, 200, res);
  } catch (e) {
    res.status(404).json({
      message: e,
    });
  }
};

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1) Getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(404).json({
        message: "You are not logged in! Please log in to get access.",
      });
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!currentUser) {
      return res.status(404).json({
        message: "The user belonging to this token does no longer exist.",
      });
    }

    next();
  } catch (e) {
    res.status(404).json({
      message: e,
    });
  }
};
