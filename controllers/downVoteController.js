import DownVotes from "../models/DownVotes.js";
import UpVotes from "../models/UpVotes.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import VideoRecordings from "../models/VideoRecording.js";
const downVotePost = async (req, res, next) => {
  let user, post, downvotes;
  try {
    let downvote = await DownVotes.findById(
      req.user.user_id,
      req.params.post_id
    );

    downvote = downvote[0][0];
    if (downvote) {
      return res.status(400).json({ message: "user already downvoted" });
    }

    downvote = new DownVotes(req.user.user_id, req.params.post_id);

    // remove a merit to the user who posted the post  if number of downvotes is a multiple of 10
    post = await Post.findById(req.params.post_id);
    post = post[0][0];
    if (post) {
      user = await User.findById(post.user_id);
      user = user[0][0];
      downvotes = await DownVotes.getByUser(post.user_id);
      downvotes = downvotes[0];
      if ((downvotes.length + 1) % 10 === 0) {
        user.merit = user.merit - 1;
        await User.updateMerit(user.user_id, user.merit);
      }
      await downvote.save();

      let upvote = await UpVotes.findById(req.user.user_id, req.params.post_id);
      upvote = upvote[0][0];
      if (upvote) {
        await UpVotes.removeUpvoteFromPost(
          req.user.user_id,
          req.params.post_id
        );
      }
      return res.status(200).json({ message: "User downvoted the post " });
    } else {
      return res.status(400).json({ mesage: "post not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.sqlMessage });
  }
};

const getAllDownVotes = async (req, res, next) => {
  try {
    const post_id = req.params.post_id;

    let post = await Post.findById(post_id);
    post = post[0][0];

    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }

    let downvotes = await DownVotes.getAlldownvotes(post_id);
    downvotes = downvotes[0];
    downvotes = Object.values(downvotes);
    return res.status(200).json({ downvotes });
  } catch (error) {
    return res.send(400).json({ message: error.sqlMessage });
  }
};
const removeDownvote = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.post_id);
    post = post[0][0];
    if (!post) {
      return res.status(400).json({ message: "post not found" });
    }

    let downvote = await DownVotes.findById(
      req.user.user_id,
      req.params.post_id
    );

    downvote = downvote[0][0];
    if (!downvote) {
      return res.status(400).json({ message: "Downvote doesn't exist" });
    }
    let downvotes = await DownVotes.removeDownvoteFromPost(
      req.user.user_id,
      req.params.post_id
    );
    return res.status(200).json({ message: "downvote removed" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.sqlMessage });
  }
};

export { downVotePost, getAllDownVotes, removeDownvote };
