import Post from "../models/Post.js";
import PostImages from "../models/PostImages.js";
import PostVideos from "../models/PostVideos.js";
import PostAudios from "../models/PostAudios.js";
import Bookmarks from "../models/Bookmark.js";
import UpVotes from "../models/Upvotes.js";
import DownVotes from "../models/DownVotes.js";
import Block from "../models/Block.js";

import User from "../models/User.js";
import Pool from "../models/Pool.js";

import { upload } from "../s3.js";

const createPost = async (req, res, next) => {
  let user_id = req.user.user_id;
  let { title, description, source_link, pool_id } = req.body;
  let attachments = req.files;
  let final_attachments = {
    audio_attachments: [],
    image_attachments: [],
    video_attachments: [],
  };

  let post = new Post(title, description, user_id, source_link);
  try {
    post = await post.save();
    let post_id = post[0].insertId;
    if (attachments.length > 0) {
      for (let i = 0; i < attachments.length; i++) {
        let attachment = attachments[i];
        let mime = attachment.mimetype.split("/")[0];
        let name = attachment.originalname.split(".");
        let finalName = `${name[0]}_${Date.now()}.${name[1]}`;

        if (mime == "image") {
          let image_url = await upload(finalName, attachment);
          let postImage = new PostImages(image_url, post_id);

          let uploaded = await postImage.save();
        } else if (mime === "video") {
          let video_url = await upload(finalName, attachment);
          let postVideo = new PostVideos(video_url, post_id, pool_id);
          postVideo = await postVideo.save();
        } else if (mime === "audio") {
          let audio_url = await upload(finalName, attachment);
          let postAudio = new PostAudios(audio_url, post_id);
          postAudio = await postAudio.save();
        } else {
          return res.status(400).json({ message: "Invalid attachment type" });
        }
      }
    }
    post = await Post.findById(post_id);
    post = post[0][0];

    final_attachments.audio_attachments = await PostAudios.findByPostId(
      post.post_id
    );
    final_attachments.audio_attachments =
      final_attachments.audio_attachments[0];

    final_attachments.image_attachments = await PostImages.findByPostId(
      post.post_id
    );
    final_attachments.image_attachments =
      final_attachments.image_attachments[0];

    final_attachments.video_attachments = await PostVideos.findByPostId(
      post.post_id
    );
    final_attachments.video_attachments =
      final_attachments.video_attachments[0];

    let user = await User.findById(post.user_id);
    user = user[0][0];
    delete user.password;
    post.user = user;

    post.downvotes = [];
    post.upvotes = [];

    post.bookmarked = false;
    post.upvoted = false;
    post.downvoted = false;

    if (final_attachments.video_attachments.length > 0) {
      let pool_id = final_attachments.video_attachments[0].pool_id;
      if (pool_id) {
        let pool = await Pool.findById(pool_id);
        pool = pool[0][0];
        post.pool = pool;
      }
    }

    return res.status(200).json({
      message: "Post created successfully",
      post: { ...post, attachments: final_attachments },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.sqlMessage });
  }
};

const getAllPosts = async (req, res, next) => {
  try {
    let posts = await Post.findAll();
    let req_user_id = req.user.user_id;
    let filters = {};
    filters = {
      byName: req.query.sortByName || "false",
      byDate: req.query.sortByDate || "true",
    };

    posts = posts[0];

    let user_ids_blocking_req_user = await Block.getIdsBlockingUser(
      req_user_id
    );

    user_ids_blocking_req_user = user_ids_blocking_req_user[0];

    let user_ids = [];
    for (let i = 0; i < user_ids_blocking_req_user.length; i++) {
      user_ids.push(user_ids_blocking_req_user[i].user_id_1);
    }
    posts = posts.filter((post) => {
      return !user_ids.includes(post.user_id);
    });

    posts = await Promise.all(
      posts.map(async (post) => {
        let user = await User.findById(post.user_id);
        user = user[0][0];
        delete user.password;
        post.user = user;

        let downvotes = await DownVotes.getAlldownvotes(post.post_id);
        downvotes = downvotes[0];
        post.downvotes = downvotes;

        let upvotes = await UpVotes.getAllupvotes(post.post_id);
        upvotes = upvotes[0];
        post.upvotes = upvotes;

        let bookmarked = await Bookmarks.getByUserAndPost(
          req_user_id,
          post.post_id
        );
        bookmarked = bookmarked[0][0];
        if (bookmarked) {
          post.bookmarked = true;
        } else {
          post.bookmarked = false;
        }

        let upvoted = await UpVotes.findById(req_user_id, post.post_id);

        upvoted = upvoted[0][0];

        if (upvoted) {
          post.upvoted = true;
        } else {
          post.upvoted = false;
        }

        let downvoted = await DownVotes.findById(req_user_id, post.post_id);
        downvoted = downvoted[0][0];
        if (downvoted) {
          post.downvoted = true;
        } else {
          post.downvoted = false;
        }

        let final_attachments = {
          audio_attachments: [],
          image_attachments: [],
          video_attachments: [],
        };

        final_attachments.audio_attachments = await PostAudios.findByPostId(
          post.post_id
        );
        final_attachments.audio_attachments =
          final_attachments.audio_attachments[0];

        final_attachments.image_attachments = await PostImages.findByPostId(
          post.post_id
        );
        final_attachments.image_attachments =
          final_attachments.image_attachments[0];

        final_attachments.video_attachments = await PostVideos.findByPostId(
          post.post_id
        );
        final_attachments.video_attachments =
          final_attachments.video_attachments[0];

        if (final_attachments.video_attachments.length > 0) {
          let pool_id = final_attachments.video_attachments[0].pool_id;
          if (pool_id) {
            let pool = await Pool.findById(pool_id);
            pool = pool[0][0];
            post.pool = pool;
          }
        }

        return { ...post, attachments: final_attachments };
      })
    );

    if (filters.byDate == "true") {
      // sort the pools by date
      posts.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateB - dateA;
      });
    }
    if (filters.byName === "true") {
      // sort the pools by title
      posts.sort((a, b) => {
        const titleA = a.title.toUpperCase();
        const titleB = b.title.toUpperCase();
        if (titleA < titleB) return -1;
        if (titleA > titleB) return 1;
        return 0;
      });
    }

    return res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.sqlMessage });
  }
};

const getPost = async (req, res, next) => {
  let post_id = req.params.id;
  try {
    let post = await Post.findById(post_id);
    post = post[0][0];

    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }
    let user = await User.findById(post.user_id);
    user = user[0][0];
    delete user.password;
    post.user = user;

    let downvotes = await DownVotes.getAlldownvotes(post.post_id);
    downvotes = downvotes[0][0];
    post.downvotes = downvotes;

    let upvotes = await UpVotes.getAllupvotes(post.post_id);
    upvotes = upvotes[0][0];
    post.upvotes = upvotes;

    let bookmarked = await Bookmarks.getByUserAndPost(
      user.user_id,
      post.post_id
    );
    bookmarked = bookmarked[0][0];
    if (bookmarked) {
      post.bookmarked = true;
    } else {
      post.bookmarked = false;
    }

    let upvoted = await UpVotes.findById(user.user_id, post.post_id);
    upvoted = upvoted[0][0];
    if (upvoted) {
      post.upvoted = true;
    } else {
      post.upvoted = false;
    }

    let downvoted = await DownVotes.findById(user.user_id, post.post_id);
    downvoted = downvoted[0][0];
    if (downvoted) {
      post.downvoted = true;
    } else {
      post.downvoted = false;
    }

    let final_attachments = {
      audio_attachments: [],
      image_attachments: [],
      video_attachments: [],
    };

    final_attachments.audio_attachments = await PostAudios.findByPostId(
      post.post_id
    );
    final_attachments.audio_attachments =
      final_attachments.audio_attachments[0];

    final_attachments.image_attachments = await PostImages.findByPostId(
      post.post_id
    );
    final_attachments.image_attachments =
      final_attachments.image_attachments[0];

    final_attachments.video_attachments = await PostVideos.findByPostId(
      post.post_id
    );
    final_attachments.video_attachments =
      final_attachments.video_attachments[0];

    if (final_attachments.video_attachments.length > 0) {
      let pool_id = final_attachments.video_attachments[0].pool_id;
      if (pool_id) {
        let pool = await Pool.findById(pool_id);
        pool = pool[0][0];
        post.pool = pool;
      }
    }

    return res.status(200).json({ ...post, attachments: final_attachments });
  } catch (error) {
    return res.status(400).json({ message: error.sqlMessage });
  }
};

const deletePost = async (req, res, next) => {
  let post_id = req.params.id;
  try {
    let post = await Post.findById(post_id);
    post = post[0][0];
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }
    let postImages = await PostImages.deleteByPostId(post_id);
    let postAudios = await PostAudios.deleteByPostId(post_id);
    let postVideos = await PostVideos.deleteByPostId(post_id);

    post = await Post.deleteById(post_id);
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.sqlMessage });
  }
};

export { createPost, getAllPosts, getPost, deletePost };
