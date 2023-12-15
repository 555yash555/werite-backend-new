import express from "express";
const router = express.Router();
import { protect } from "../middlewares/authMiddleware.js";
import { accessChat, getMyChats } from "../controllers/chatController.js";
import {
  findAllMessages,
  sendMessage,
} from "../controllers/messageController.js";

router.route("/:chatId").get(protect, findAllMessages);
router.route("/").post(protect, sendMessage);

export default router;
