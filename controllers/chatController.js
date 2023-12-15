import User from "../models/User.js";
import Chat from "../models/Chat.js";
import Block from "../models/Block.js";

import jwt from "jsonwebtoken";
import { generateUploadImageURL } from "../s3.js";

const accessChat = async (req, res, next) => {
  let user_one = req.user.user_id;
  let user_two = parseInt(req.query.user_id);

  let block = await Block.findById(user_two, user_one);
  block = block[0][0];

  if (block) {
    return res.status(400).json({ message: "user has blocked you" });
  }

  block = await Block.findById(user_one, user_two);
  block = block[0][0];

  if (block) {
    return res.status(400).json({ message: "you have blocked the user" });
  }

  let user1 = await User.findById(user_one);
  if (!user1[0] || user1[0].length === 0) {
    return res.status(400).json({ message: "user not found" });
  }
  let user = await User.findById(user_two);
  if (!user[0] || user[0].length === 0) {
    return res.status(400).json({ message: "user not found" });
  }
  try {
    let chat = await Chat.findByUsers(user_one, user_two);
    chat = chat[0][0];

    if (!chat) {
      chat = new Chat(user_one, user_two);
      await chat.save();
    }
    chat = await Chat.findByUsers(user_one, user_two);
    chat = chat[0][0];

    return res.status(200).json(chat);
  } catch (err) {
    console.log(err);
  }
};

const getMyChats = async (req, res, next) => {
  let user_id = req.user.user_id;

  let chats = await Chat.findByUser(user_id);
  chats = chats[0];
  return res.status(200).json(chats);
};

export { accessChat, getMyChats };
