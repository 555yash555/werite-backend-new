import express from "express";

const router = express.Router();
import multer from "multer";
const upload = multer();

import {
  createPost,
  getAllPosts,
  getPost,
  deletePost,
} from "../controllers/postControllers.js";

import { reportPost } from "../controllers/reportController.js";

import { protect } from "../middlewares/authMiddleware.js";

router
  .route("/")
  .get(protect, getAllPosts)
  .post(protect, upload.array("attachments", 5), createPost);
router.route("/:id/report").post(protect, reportPost);
router.route("/:id").get(protect, getPost).delete(protect, deletePost);

export default router;
