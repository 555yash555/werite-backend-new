import express from "express";
const router = express.Router();
import { protect } from "../middlewares/authMiddleware.js";
import { accessChat, getMyChats } from "../controllers/chatController.js";

router.route("/accessChat/").get(protect, accessChat);
router.route("/").get(protect, getMyChats);

export default router;
