import express from "express";
import multer from "multer";
const upload = multer();
const router = express.Router();

import {
  registerUser,
  authUser,
  getUserProfile,
  getMyPosts,
  addMyBio,
  uploadProfile,
  getMyUpVotes,
  getMyDownVotes,
  getMyBookmarks,
  searchUser,
  searchLikeUsers,
  forgotPassword,
  resetPassword,
  blockUser,
  unblockUser,
  getBlockedUsers,
} from "../controllers/userControllers.js";
import { protect } from "../middlewares/authMiddleware.js";

router.route("/search/").get(protect, searchUser);
router.route("/searchLike/").get(protect, searchLikeUsers);

router.route("/upvotes").get(protect, getMyUpVotes);
router.route("/downvotes").get(protect, getMyDownVotes);
router.route("/bookmarks").get(protect, getMyBookmarks);

router.route("/login").post(authUser);
router.route("/forgot").post(forgotPassword);
router.route("/reset/:token").put(resetPassword);
router
  .route("/uploads")
  .patch(protect, upload.single("profile_pic"), uploadProfile);

router
  .route("/block/:id")
  .post(protect, blockUser)
  .delete(protect, unblockUser);
router.route("/block").get(protect, getBlockedUsers);
router.route("/:id").get(protect, getUserProfile);

router
  .route("/")
  .post(registerUser)
  .get(protect, getMyPosts)
  .patch(protect, addMyBio);

export default router;
