import User from "../models/User.js";
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import Block from "../models/Block.js";

const sendMessage = async (req, res, next) => {
  let user_one = req.user.user_id;
  let user_two = req.query.user_id;
  let message = req.body.message;

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

  let user = await User.findById(user_two);
  if (!user[0] || user[0].length === 0) {
    return res.status(400).json({ message: "user not found" });
  }

  let chat = await Chat.findByUsers(user_one, user_two);
  chat = chat[0][0];

  if (chat) {
    let newMessage = new Message(user_one, chat.chat_id, message);
    newMessage = await newMessage.save();
    newMessage = newMessage[0];
    newMessage = await Message.findById(newMessage.insertId);
    newMessage = newMessage[0][0];

    await Chat.updateLatestMessageId(chat.chat_id, newMessage.message_id);
    return res.status(200).json(newMessage);
  } else {
    let newChat = new Chat(user_one, user_two);
    newChat = await newChat.save();
    let chat = await Chat.findByUsers(user_one, user_two);
    chat = chat[0][0];

    let newMessage = new Message(user_one, chat.chat_id, message);
    newMessage = await newMessage.save();
    newMessage = newMessage[0];
    newMessage = await Message.findById(newMessage.insertId);
    newMessage = newMessage[0][0];
    await Chat.updateLatestMessageId(chat.chat_id, newMessage.message_id);
    return res.status(200).json(newMessage);
  }
};

const findAllMessages = async (req, res, next) => {
  let user_id = req.user.user_id;
  let chat_id = req.params.chatId;

  let chat = await Chat.findById(chat_id);
  chat = chat[0][0];

  if (!chat) {
    return res.status(400).json({ message: "Chat not found" });
  }

  if (chat.user_first !== user_id && chat.user_second !== user_id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  let messages = await Message.findByChat(chat_id);
  messages = messages[0];

  return res.status(200).json(messages);
};

export { sendMessage, findAllMessages };
