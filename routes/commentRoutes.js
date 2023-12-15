import express from "express";
// import {
//   getAllComments,
//   getReplies,
// } from "../controllers/commentController.js";

import {
  createComment,
  getAllComments,
  getReplies,
} from "../controllers/postCommentsController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/post/:post_id")
  .post(protect, createComment)
  .get(protect, getAllComments);
router.route("/post/:post_id/:comment_id").get(protect, getReplies);

export default router;
