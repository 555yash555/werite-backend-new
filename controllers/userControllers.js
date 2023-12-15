import User from "../models/User.js";


import Bookmarks from "../models/Bookmark.js";
import Post from "../models/Post.js";
import Block from "../models/Block.js";
import jwt from "jsonwebtoken";
import { generateUploadImageURL } from "../s3.js";
import compression from "compression";
import crypto from "crypto";
import PostImages from "../models/PostImages.js";
import PostVideos from "../models/PostVideos.js";
import PostAudios from "../models/PostAudios.js";

import UpVotes from "../models/UpVotes.js";
import DownVotes from "../models/DownVotes.js";

import nodemailer from "nodemailer";
import Pool from "../models/Pool.js";

const registerUser = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      gender,
      mobile,
      username,
      is_active,
      inCall,
      profile_pic,
      bio,
      type,
    } = req.body;
    let user = new User(
      name,
      email,
      password,
      gender,
      mobile,
      username,
      is_active,
      inCall,
      profile_pic,
      bio,
      type
    );

    user = await user.save();
    // console.log(user)

    return res.status(201).json({ message: "User created" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.sqlMessage });
  }
};

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.user_id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    id: user.user_id,
    name: user.name,
    email: user.email,
    gender: user.gender,
    username: user.username,
    merit: user.merit,
    type: user.type,
    token,
  });
};

const authUser = async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password!" });
  }

  // 2) Check if user exists && password is correct
  let user = await User.findOne(email);
  user = user[0][0];

  if (!user || !User.matchPassword(user, password)) {
    return res.status(401).json({ message: "Incorrect email or password" });
  }

  // 3) If everything ok, send token to client
  //   createSendToken(user, 200, res);
  createSendToken(user, 200, res);
};

const forgotPassword = async (req, res, next) => {
  let { email } = req.body;

  // 1) Find the user by email
  try {
    let user = await User.findOne(email);
    user = user[0][0];
    // If no user is found, return an error
    if (!user) {
      return res.status(401).json({ message: "No user found with that email" });
    }

    // 2) Generate the random reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // 3) Save the reset token and its expiration time (1 hour) in the user object
    await User.setResetPasswordFields(
      user.user_id,
      resetToken,
      Date.now() + 3600000
    );

    // 4) Send the reset token to the user's email
    // Here you would typically use a service to send an email with the reset token and a link to reset the password.
    // You can use a library like Nodemailer for sending emails.

    // Example using Nodemailer:
    const transporter = nodemailer.createTransport({
      pool: true,
      host: "",
      port: 587,
      secure: false,
      auth: {
        user: "",
        pass: "",
      },
      tls: {
        ciphers: "SSLv3",
      },
    });

    const mailOptions = {
      from: "",
      to: "",
      subject: "Password Reset",
      text:
        `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
        `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
        `http://${req.headers.host}/reset/${resetToken}\n\n` +
        `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    console.log(resetToken);
    // await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Reset token sent to your email" });
  } catch (error) {
    console.log(error);
    if (error.sqlMessage)
      return res.status(400).json({ message: error.sqlMessage });
    return res.status(400).json({ message: error.message });
  }
};

const resetPassword = async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  // 1) Find the user with the reset token
  try {
    let user = await User.findByResetToken(token);

    user = user[0][0];
    // If no user is found, return an error
    if (!user) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    let expiry = user.resetPasswordExpires;
    // If the reset token has expired, return an error
    if (Date.now() > expiry) {
      return res.status(401).json({ message: "Token is expired" });
    }

    // 2) Set the new password
    await User.resetPassword(user.user_id, password);

    return res.status(200).json({ message: "Password updated" });
  } catch (error) {
    console.log(error);
    if (error.sqlMessage)
      return res.status(400).json({ message: error.sqlMessage });
    return res.status(400).json({ message: error.message });
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    let reqUser = await User.findById(req.user.user_id);
    reqUser = reqUser[0][0];
    let user = await User.findById(req.params.id);
    user = user[0][0];

    let upvotes, downvotes, bookmarks;
    if (user) {
      let block = await Block.findById(user.user_id, reqUser.user_id);
      block = block[0][0];
      if (block) {
        return res.status(400).json({ message: "user has blocked you" });
      }

      block = await Block.findById(reqUser.user_id, user.user_id);
      block = block[0][0];
      if (block) {
        return res.status(400).json({ message: "you have blocked the user" });
      }
      delete user.password;
      // if (reqUser.user_id === user.user_id) {
      upvotes = await UpVotes.getUpvotedPostsByUser(user.user_id);
      upvotes = upvotes[0];

      downvotes = await DownVotes.getDownvotedPostsByUser(user.user_id);
      downvotes = downvotes[0];

      bookmarks = await Bookmarks.getBookmarkedPostsByUser(user.user_id);
      bookmarks = bookmarks[0];

      return res.status(200).json({ ...user, upvotes, downvotes, bookmarks });
      // }

      // return res.status(200).json(user);
    } else {
      return res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.sqlMessage });
  }
};

const getMyPosts = async (req, res, next) => {
  try {
    let user_id;
    if(req.query.id){
      user_id = req.query.id;
    }
    else{
      user_id = req.user.user_id;
    }
    
    let user = await User.findById(user_id);
    user = user[0][0];
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    
    let posts = await await Post.findByUserId(user_id);
    let req_user_id = req.user.user_id;
    let filters = {};
    filters = {
      byName: req.query.sortByName || "false",
      byDate: req.query.sortByDate || "true",
    };

    posts = posts[0];

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
    return res.status(400).json({ message: error.sqlMessage });
  }
};

const addMyBio = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const bio = req.body.bio;
    await User.addUserBio(user_id, bio);
    return res.status(200).json(bio);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.sqlMessage });
  }
};

const uploadProfile = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    console.log(req.file);
    const profilePath = req.file;
    const profileKeyPath = profilePath.originalname;
    let s3ImgUrl = await generateUploadImageURL(profileKeyPath, req.file);
    s3ImgUrl = s3ImgUrl.split("?")[0];
    await User.addProfileImage(user_id, s3ImgUrl);
    return res.status(200).json(s3ImgUrl);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.sqlMessage });
  }
};

const getMyUpVotes = async (req, res, next) => {
  try {
    let user = await User.findById(req.user.user_id);
    user = user[0][0];
    delete user.password;
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    let upVotes = await UpVotes.getByUser(req.user.user_id);
    upVotes = upVotes[0];

    let upvotedPosts = await Promise.all(
      upVotes.map(async (upvote) => {
        let post_id = upvote.post_id;

        let post = await Post.findById(post_id);
        post = post[0][0];

        if (!post) {
          return res.status(400).json({ message: "post not found" });
        }

        let post_user = await User.findById(post.user_id);
        post_user = post_user[0][0];

        if (!post_user) {
          return res.status(400).json({ message: "post user not found" });
        }

        delete post_user.password;
        post.user = post_user;

        let post_upvotes = await UpVotes.getAllupvotes(post.post_id);
        post_upvotes = post_upvotes[0];

        post.upvotes = post_upvotes;

        let post_downvotes = await DownVotes.getAlldownvotes(post.post_id);
        post_downvotes = post_downvotes[0];

        post.downvotes = post_downvotes;

        let bookmarked = await Bookmarks.getByUserAndPost(
          req.user.user_id,
          post.post_id
        );
        bookmarked = bookmarked[0][0];
        if (bookmarked) {
          post.bookmarked = true;
        } else {
          post.bookmarked = false;
        }

        let upvoted = await UpVotes.findById(req.user.user_id, post.post_id);
        upvoted = upvoted[0][0];
        if (upvoted) {
          post.upvoted = true;
        } else {
          post.upvoted = false;
        }

        let downvoted = await DownVotes.findById(
          req.user.user_id,
          post.post_id
        );
        downvoted = downvoted[0][0];
        if (downvoted) {
          post.downvoted = true;
        } else {
          post.downvoted = false;
        }

        return post;
      })
    );
    res.status(200).json(upvotedPosts);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.sqlMessage });
  }
};

const getMyDownVotes = async (req, res, next) => {
  try {
    let user = await User.findById(req.user.user_id);
    user = user[0][0];
    delete user.password;
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    let downVotes = await DownVotes.getByUser(req.user.user_id);
    downVotes = downVotes[0];

    let downvotedPosts = await Promise.all(
      downVotes.map(async (downvote) => {
        let post_id = downvote.post_id;

        let post = await Post.findById(post_id);
        post = post[0][0];

        if (!post) {
          return res.status(400).json({ message: "post not found" });
        }

        let post_user = await User.findById(post.user_id);
        post_user = post_user[0][0];

        if (!post_user) {
          return res.status(400).json({ message: "post user not found" });
        }

        delete post_user.password;
        post.user = post_user;

        let post_upvotes = await UpVotes.getAllupvotes(post.post_id);
        post_upvotes = post_upvotes[0];

        post.upvotes = post_upvotes;

        let post_downvotes = await DownVotes.getAlldownvotes(post.post_id);
        post_downvotes = post_downvotes[0];

        post.downvotes = post_downvotes;

        let bookmarked = await Bookmarks.getByUserAndPost(
          req.user.user_id,
          post.post_id
        );
        bookmarked = bookmarked[0][0];
        if (bookmarked) {
          post.bookmarked = true;
        } else {
          post.bookmarked = false;
        }

        let upvoted = await UpVotes.findById(req.user.user_id, post.post_id);
        upvoted = upvoted[0][0];
        if (upvoted) {
          post.upvoted = true;
        } else {
          post.upvoted = false;
        }

        let downvoted = await DownVotes.findById(
          req.user.user_id,
          post.post_id
        );
        downvoted = downvoted[0][0];
        if (downvoted) {
          post.downvoted = true;
        } else {
          post.downvoted = false;
        }

        return post;
      })
    );

    res.status(200).json(downvotedPosts);
  } catch (error) {
    console.log(error);
    if (error.sqlMessage) {
      return res.status(400).json({ message: error.sqlMessage });
    }
    return res.status(400).json({ message: error });
  }
};

const getMyBookmarks = async (req, res, next) => {
  try {
    let user = await User.findById(req.user.user_id);
    user = user[0][0];
    delete user.password;
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    let bookmarks = await Bookmarks.getByUser(req.user.user_id);
    bookmarks = bookmarks[0];

    let bookmarkedPosts = await Promise.all(
      bookmarks.map(async (bookmark) => {
        let post_id = bookmark.post_id;

        let post = await Post.findById(post_id);
        post = post[0][0];

        if (!post) {
          return res.status(400).json({ message: "post not found" });
        }

        let post_user = await User.findById(post.user_id);
        post_user = post_user[0][0];

        if (!post_user) {
          return res.status(400).json({ message: "post user not found" });
        }

        delete post_user.password;
        post.user = post_user;

        let post_upvotes = await UpVotes.getAllupvotes(post.post_id);
        post_upvotes = post_upvotes[0];

        post.upvotes = post_upvotes;

        let post_downvotes = await DownVotes.getAlldownvotes(post.post_id);
        post_downvotes = post_downvotes[0];

        post.downvotes = post_downvotes;

        let bookmarked = await Bookmarks.getByUserAndPost(
          req.user.user_id,
          post.post_id
        );
        bookmarked = bookmarked[0][0];
        if (bookmarked) {
          post.bookmarked = true;
        } else {
          post.bookmarked = false;
        }

        let upvoted = await UpVotes.findById(req.user.user_id, post.post_id);
        upvoted = upvoted[0][0];
        if (upvoted) {
          post.upvoted = true;
        } else {
          post.upvoted = false;
        }

        let downvoted = await DownVotes.findById(
          req.user.user_id,
          post.post_id
        );
        downvoted = downvoted[0][0];
        if (downvoted) {
          post.downvoted = true;
        } else {
          post.downvoted = false;
        }

        return post;
      })
    );

    res.status(200).json(bookmarkedPosts);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.sqlMessage });
  }
}

const searchUser = async (req, res, next) => {
  let username = req.query.username;

  if (req.query.username === req.user.username) {
    return res.status(400).json({ message: "You cannot search yourself" });
  }

  try {
    let users = await User.findUserByUsername(username);
    users = users[0];
    users.map((user) => {
      delete user.password;
      return user;
    });

    res.status(200).json(users);
  } catch (error) {
    return res.status(400).json({ message: error.sqlMessage });
  }
};

const searchLikeUsers = async (req, res, next) => {
  let username = req.query.username;

  if (req.query.username === req.user.username) {
    return res.status(400).json({ message: "You cannot search yourself" });
  }

  try {
    let users = await User.findLikeUsersByUsername(username);
    users = users[0];
    users = users.map((user) => {
      delete user.password;
      return user;
    });

    let user_ids_blocking_req_user = await Block.getIdsBlockingUser(
      req.user.user_id
    );

    user_ids_blocking_req_user = user_ids_blocking_req_user[0];

    let user_ids = [];
    for (let i = 0; i < user_ids_blocking_req_user.length; i++) {
      user_ids.push(user_ids_blocking_req_user[i].user_id_1);
    }

    users = users.filter((user) => {
      return !user_ids.includes(user.user_id);
    });

    res.status(200).json(users);
  } catch (error) {
    return res.status(400).json({ message: error.sqlMessage });
  }
};

const blockUser = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const blocked_user_id = req.params.id;
    let user_1 = await User.findById(user_id);
    user_1 = user_1[0][0];
    if (!user_1) {
      return res.status(400).json({ message: "user not found" });
    }
    let user_2 = await User.findById(blocked_user_id);
    user_2 = user_2[0][0];
    if (!user_2) {
      return res.status(400).json({ message: "user not found" });
    }

    let block = new Block(user_id, blocked_user_id);
    block = block.save();
    return res.status(200).json({ message: "user blocked" });
  } catch (error) {
    return res.status(400).json({ message: error.sqlMessage });
  }
};

const unblockUser = async (req, res, next) => {
  const user_id = req.user.user_id;
  const blocked_user_id = req.params.id;
  try {
    let user_1 = await User.findById(user_id);
    user_1 = user_1[0][0];
    if (!user_1) {
      return res.status(400).json({ message: "user not found" });
    }
    let user_2 = await User.findById(blocked_user_id);
    user_2 = user_2[0][0];
    if (!user_2) {
      return res.status(400).json({ message: "user not found" });
    }
    let block = await Block.findById(user_id, blocked_user_id);
    block = block[0][0];
    if (!block) {
      return res.status(400).json({ message: "user not blocked" });
    }

    await Block.unblockUser(user_id, blocked_user_id);
    return res.status(200).json({ message: "user unblocked" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.sqlMessage });
  }
};

const getBlockedUsers = async (req, res, next) => {
  try {
    let user_id = req.user.user_id;
    let blocked_users = await Block.getBlockedUsers(user_id);
    blocked_users = blocked_users[0];
    blocked_users = blocked_users.map((user) => {
      delete user.password;
      return user;
    });
    return res.status(200).json(blocked_users);
  } catch (error) {
    return res.status(400).json({ message: error.sqlMessage });
  }
};

export {
  registerUser,
  authUser,
  uploadProfile,
  getUserProfile,
  getMyPosts,
  addMyBio,
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
};
