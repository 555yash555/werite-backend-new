import express from "express";
import {
  getAllUpVotes,
  removeUpvote,
  UpVotePost,
} from "../controllers/upVoteController.js";

const router = express.Router();

import { protect } from "../middlewares/authMiddleware.js";

router
  .route("/post/:post_id")
  .post(protect, UpVotePost)
  .get(protect, getAllUpVotes)
  .delete(protect, removeUpvote);

export default router;
