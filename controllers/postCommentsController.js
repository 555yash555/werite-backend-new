import PostComments from "../models/PostComment.js";
import User from "../models/User.js";

import Post from "../models/Post.js";
import e from "cors";

const createComment = async (req, res, next) => {
  try {
    let post_id = req.params.post_id;
    let reply_of_comment_id = req.body.reply_of_comment_id;
    let user_id = req.user.user_id;

    let post = await Post.findById(post_id);
    post = post[0][0];
    if (!post) {
      return res.status(400).json({ message: "post not found" });
    }
    if (reply_of_comment_id) {
      let reply_comment = await PostComments.findById(reply_of_comment_id);
      reply_comment = reply_comment[0][0];
      if (!reply_comment) {
        return res.status(400).json({ message: "comment not found" });
      }
    }

    let comment = new PostComments(
      req.params.post_id,
      user_id,
      req.body.comment,
      reply_of_comment_id
    );

    const commentId = await comment.save();
    let user = await User.findById(req.user.user_id);
    user = user[0][0];
    delete user.password;
    comment.user = user;

    if (post.user_id === user_id) {
      comment.is_owner = true;
    }

    return res.status(200).json(comment);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.sqlMessage });
  }
};

const getAllComments = async (req, res, next) => {
  try {
    let user_id = req.user.user_id;
    let post_id = req.params.post_id;
    let comments = await PostComments.findAllComments(post_id);
    comments = comments[0];
    console.log(comments);
    try {
      comments = await Promise.all(
        comments.map(async (comment) => {
          let user = await User.findById(comment.user_id);
          user = user[0][0];
          delete user.password;
          comment.user = user;

          if (comment.user_id === user_id) {
            comment.is_owner = true;
          }
          return comment;
        })
      );
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: error.sqlMessage });
    }

    return res.status(200).json(comments);
  } catch (error) {
    return res.status(400).json({ message: error.sqlMessage });
  }
};

const getAllParentComments = async (req, res, next) => {
  try {
    let parentComments = await PostComments.findAllParentComment(
      req.params.post_id
    );
    parentComments = parentComments[0];

    return res.status(200).json(parentComments);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.sqlMessage });
  }
};

const getReplies = async (req, res, next) => {
  try {
    let post_id = req.params.post_id;
    let comment_id = req.params.comment_id;

    let post = await Post.findById(post_id);
    post = post[0][0];
    if (!post) {
      return res.status(400).json({ message: "post not found" });
    }
    let comment = await PostComments.findById(comment_id);
    comment = comment[0][0];
    if (!comment) {
      return res.status(400).json({ message: "comment not found" });
    }

    let childComments = await PostComments.findAllChildComment(
      comment_id,
      post_id
    );
    childComments = childComments[0];

    childComments = await Promise.all(
      childComments.map(async (comment) => {
        let user = await User.findById(comment.user_id);
        user = user[0][0];
        delete user.password;
        comment.user = user;
        return comment;
      })
    );

    return res.status(200).json(childComments);
  } catch (error) {
    return res.status(400).json({ message: error.sqlMessage });
  }
};

export { createComment, getAllComments, getAllParentComments, getReplies };
