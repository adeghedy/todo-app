import express from "express";

import {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  updatePost,
} from "../controllers/postController";

import { protect } from "../controllers/authController";

export const router = express.Router();

router.route("/:userId/").get(protect, getAllPosts).post(protect, createPost);

router
  .route("/:userId/:id")
  .get(protect, getPost)
  .put(protect, updatePost)
  .delete(protect, deletePost);
