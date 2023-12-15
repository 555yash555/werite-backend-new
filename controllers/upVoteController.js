import UpVotes from "../models/Upvotes.js";
import DownVotes from "../models/DownVotes.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

const UpVotePost = async (req, res, next) => {
  let post, user;
  try {
    let upvote = await UpVotes.findById(req.user.user_id, req.params.post_id);
    upvote = upvote[0][0];
    if (upvote) {
      return res.status(400).json({ message: "user already upvoted" });
    }
    upvote = new UpVotes(req.user.user_id, req.params.post_id);

    // // Add a merit to the user who posted the video
    post = await Post.findById(req.params.post_id);
    post = post[0][0];
    if (post) {
      user = await User.findById(post.user_id);
      user = user[0][0];
      user.merit = user.merit + 1;
      await User.updateMerit(user.user_id, user.merit);
    } else {
      return res.status(400).json({ message: "post not found" });
    }
    await upvote.save();

    let downvote = await DownVotes.findById(
      req.user.user_id,
      req.params.post_id
    );
    downvote = downvote[0][0];
    if (downvote) {
      await DownVotes.removeDownvoteFromPost(
        req.user.user_id,
        req.params.post_id
      );
    }
    return res.status(200).json({ message: "user upvoted the post" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.sqlMessage });
  }
};

const getAllUpVotes = async (req, res, next) => {
  try {
    const post_id = req.params.post_id;
    let post = await Post.findById(post_id);
    post = post[0][0];
    if (!post) {
      return res.status(400).json({ message: "post not found" });
    }
    let upvotes = await UpVotes.getAllupvotes(post_id);
    upvotes = upvotes[0];
    upvotes = Object.values(upvotes);

    return res.status(200).json({ upvotes });
  } catch (error) {
    console.log(error);
    return res.send(400).json({ message: error.sqlMessage });
  }
};

const removeUpvote = async (req, res, next) => {
  try {
    const post_id = req.params.post_id;
    const user_id = req.user.user_id;
    let post = await Post.findById(post_id);
    post = post[0][0];
    if (!post) {
      return res.status(400).json({ message: "post not found" });
    }
    let upvote = await UpVotes.findById(user_id, post_id);
    upvote = upvote[0][0];
    if (!upvote) {
      return res.status(400).json({ message: "user has not upvoted" });
    }

    upvote = await UpVotes.removeUpvoteFromPost(user_id, post_id);
    return res.status(200).json({ message: "upvote removed" });
  } catch (error) {
    return res.status(400).json({ message: error.sqlMessage });
  }
};

export { UpVotePost, getAllUpVotes, removeUpvote };
