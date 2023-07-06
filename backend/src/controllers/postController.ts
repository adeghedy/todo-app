import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
const Post = require("../models/postModel");

const prisma = new PrismaClient();

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    // Find all posts satisfying userId = req.params.userId
    const posts = await prisma.post.findMany({
      where: {
        userId: req.params.userId,
      },
    });

    res.status(200).json({
      status: "success",
      results: posts.length,
      data: {
        posts,
      },
    });
  } catch (e) {
    res.status(404).json({
      message: e,
    });
  }
};

export const getPost = async (req: Request, res: Response) => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
  } catch (e) {
    res.status(404).json({
      message: e,
    });
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const newPost = await prisma.post.create({
      data: {
        content: req.body.content,
        userId: req.body.userId,
      },
    });

    res.status(201).json({
      status: "success",
      data: {
        posts: [newPost],
      },
    });
  } catch (e) {
    res.status(400).json({
      message: e,
    });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const post = await prisma.post.update({
      where: {
        id: req.params.id,
      },
      data: {
        content: req.body.content,
        userId: req.body.userId,
      },
    });

    res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
  } catch (e) {
    res.status(404).json({
      message: e,
    });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    await prisma.post.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (e) {
    res.status(404).json({
      message: e,
    });
  }
};
