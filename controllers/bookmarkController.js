import Bookmarks from "../models/Bookmark.js";
import UpVotes from "../models/UpVote.js";
import User from "../models/User.js";
import Post from "../models/Post.js";

const bookmarkPost = async (req, res, next) => {
  let bookmark;
  try {
    let post = await Post.findById(req.params.post_id);
    post = post[0][0];
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }

    let user = await User.findById(req.user.user_id);
    user = user[0][0];
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    bookmark = await Bookmarks.getByUserAndPost(
      user.user_id,
      req.params.post_id
    );
    bookmark = bookmark[0][0];
    if (bookmark) {
      return res.status(400).json({ message: "Post already bookmarked" });
    }

    bookmark = new Bookmarks(req.user.user_id, req.params.post_id);
    await bookmark.save();
    return res.status(200).json({ message: "user bookmarked the Post" });
  } catch (error) {
    console.log(error);
    if (error.sqlMessage) {
      return res.status(400).json({ message: error.sqlMessage });
    }
    return res.status(400).json({ message: error });
  }
};

const removeBookmark = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.post_id);
    post = post[0][0];
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }
    let bookmark = await Bookmarks.getByUserAndPost(
      req.user.user_id,
      req.params.post_id
    );
    bookmark = bookmark[0][0];
    if (!bookmark) {
      return res.status(400).json({ message: "Post not bookmarked" });
    }

    const post_id = req.params.post_id;
    const user_id = req.user.user_id;
    let bookmarks = await Bookmarks.removeBookmarkFromPost(user_id, post_id);
    return res.status(200).json({ message: "bookmark removed" });
  } catch (error) {
    return res.status(400).json({ message: error.sqlMessage });
  }
};

export { bookmarkPost, removeBookmark };
