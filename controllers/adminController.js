import User from "../models/User.js";
import UpVotes from "../models/Upvotes.js";
import DownVotes from "../models/DownVotes.js";
import Bookmarks from "../models/Bookmark.js";
import Pool from "../models/Pool.js";
import Prompt from "../models/Prompt.js";
import PoolRequest from "../models/PoolRequest.js";

const getAllUsers = async (req, res, next) => {
  let admin = await User.findById(req.user.user_id);
  admin = admin[0][0];

  if (admin) {
    if (admin.type !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    } else {
      try {
        let users = await User.findAll();
        users = users[0];

        users = await Promise.all(
          users.map(async (user) => {
            delete user.password;
            let upvotes = await UpVotes.getByUser(user.user_id);
            upvotes = upvotes[0];
            upvotes = Object.values(upvotes);
            let downvotes = await DownVotes.getByUser(user.user_id);
            downvotes = downvotes[0];
            downvotes = Object.values(downvotes);
            let bookmarks = await Bookmarks.getByUser(user.user_id);
            bookmarks = bookmarks[0];
            bookmarks = Object.values(bookmarks);
            return { ...user, upvotes, downvotes, bookmarks };
          })
        );
        return res.status(200).json(users);
      } catch (error) {
        return res.status(400).json({ message: error.sqlMessage });
      }
    }
  } else {
    return res.status(403).json({ message: "User Not Found" });
  }
};

const getUser = async (req, res, next) => {
  let admin = await User.findById(req.user.user_id);
  admin = admin[0][0];

  if (admin) {
    if (admin.type !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    } else {
      try {
        let user = await User.findById(req.params.user_id);
        user = user[0][0];
        delete user.password;
        if (!user) {
          return res.status(404).json({ message: "User Not Found" });
        }

        let upvotes = await UpVotes.getByUser(user.user_id);
        upvotes = upvotes[0];
        console.log(upvotes);
        upvotes = Object.values(upvotes);
        let downvotes = await DownVotes.getByUser(user.user_id);
        downvotes = downvotes[0];
        downvotes = Object.values(downvotes);
        let bookmarks = await Bookmarks.getByUser(user.user_id);
        bookmarks = bookmarks[0];
        bookmarks = Object.values(bookmarks);
        return res.status(200).json({ ...user, upvotes, downvotes, bookmarks });
      } catch (error) {
        return res.status(400).json({ message: error.sqlMessage });
      }
    }
  }
};

const getAllPools = async (req, res, next) => {
  let admin = await User.findById(req.user.user_id);
  admin = admin[0][0];

  if (admin) {
    if (admin.type !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    } else {
      try {
        let pools = await Pool.findAll(admin.user_id);
        pools = pools[0];

        pools = await Promise.all(
          pools.map(async (pool) => {
            let prompts = await Prompt.findByPoolId(pool.pool_id);
            prompts = prompts[0];
            prompts = Object.values(prompts);

            let poolRequests = await PoolRequest.findAll(pool.pool_id);
            poolRequests = poolRequests[0];
            poolRequests = Object.values(poolRequests);

            return { ...pool, prompts, poolRequests };
          })
        );

        return res.status(200).json(pools);
      } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error.sqlMessage });
      }
    }
  } else {
    return res.status(403).json({ message: "User Not Found" });
  }
};

const getPool = async (req, res, next) => {
  let admin = await User.findById(req.user.user_id);
  admin = admin[0][0];

  if (admin) {
    if (admin.type !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    } else {
      try {
        let pool = await Pool.findById(req.params.pool_id);
        pool = pool[0][0];

        if (!pool) {
          return res.status(404).json({ message: "Pool Not Found" });
        }

        let prompts = await Prompt.findByPoolId(pool.pool_id);
        prompts = prompts[0];
        prompts = Object.values(prompts);

        let poolRequests = await PoolRequest.findAll(pool.pool_id);
        poolRequests = poolRequests[0];
        poolRequests = Object.values(poolRequests);

        return res.status(200).json({ ...pool, prompts, poolRequests });
      } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error.sqlMessage });
      }
    }
  } else {
    return res.status(403).json({ message: "User Not Found" });
  }
};

export { getAllUsers, getAllPools, getUser, getPool };
