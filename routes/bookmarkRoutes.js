import express from "express";
import {
  bookmarkPost,
  removeBookmark,
} from "../controllers/bookmarkController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();
router
  .route("/post/:post_id")
  .post(protect, bookmarkPost)
  .delete(protect, removeBookmark);

export default router;
