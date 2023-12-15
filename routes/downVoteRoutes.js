import express from "express";
import {
  downVotePost,
  getAllDownVotes,
  removeDownvote,
} from "../controllers/downVoteController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/post/:post_id")
  .post(protect, downVotePost)
  .get(protect, getAllDownVotes)
  .delete(protect, removeDownvote);

export default router;
