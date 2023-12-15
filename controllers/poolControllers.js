import Pool from "../models/Pool.js";
import User from "../models/User.js";
import Prompt from "../models/Prompt.js";
import Block from "../models/Block.js";
import dotenv from "dotenv";

dotenv.config();

const maxPeopleAllowed = process.env.MAX_PEOPLE_ALLOWED;

const createPool = async (req, res, next) => {
  try {
    const {
      title,
      category,
      merit_required: meritRequired,
      discussion_type: discussionType,
      spectators_allowed: spectatorsAllowed,
      stance,
      guts,
      source,
      duration,
      is_active: isActive,
      people_allowed: peopleAllowed,
    } = req.body;

    let prompts = req.body.prompts;
    if (prompts === undefined || prompts.length === 0) {
      prompts = [];
    }

    let pool = new Pool(
      title,
      category,
      meritRequired,
      discussionType,
      spectatorsAllowed,
      stance,
      guts,
      source,
      duration,
      isActive,
      req.user.user_id,
      peopleAllowed
    );

    pool = await pool.save();
    // create prompts for the pool
    prompts.forEach((prompt) => {
      let newPrompt = new Prompt(
        prompt.text,
        pool[0].insertId,
        prompt.timeMinutes
      );
      newPrompt.save();
    });

    return res.status(201).json({ message: "Pool created" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.sqlMessage });
  }
};

const getPools = async (req, res, next) => {
  let filters = {};
  filters = {
    byName: req.query.sortByName || "false",
    byDate: req.query.sortByDate || "true",
    byGender: req.query.filterByGender || "all", // male, female, all
    isLive: req.query.isLive || undefined,
  };

  try {
    let pools = await Pool.findAll(req.user.user_id);
    pools = pools[0];

    let user_ids_blocking_req_user = await Block.getIdsBlockingUser(
      req.user.user_id
    );

    user_ids_blocking_req_user = user_ids_blocking_req_user[0];

    let user_ids = [];
    for (let i = 0; i < user_ids_blocking_req_user.length; i++) {
      user_ids.push(user_ids_blocking_req_user[i].user_id_1);
    }
    pools = pools.filter((pool) => {
      return !user_ids.includes(pool.user_id);
    });

    pools = await Promise.all(
      pools.map(async (pool) => {
        let user = await User.findById(pool.user_id);

        user = user[0][0];
        user.password = undefined;
        user.mobile = undefined;
        user.merit = undefined;
        user.created_at = undefined;
        let prompts = await Prompt.findByPoolId(pool.pool_id);
        prompts = prompts[0];
        pool.prompts = prompts;
        return { ...pool, user };
      })
    );

    if (filters.byDate == "true") {
      // sort the pools by date
      pools.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateB - dateA;
      });
    }

    if (filters.byName === "true") {
      // sort the pools by title
      pools.sort((a, b) => {
        const titleA = a.title.toUpperCase();
        const titleB = b.title.toUpperCase();
        if (titleA < titleB) return -1;
        if (titleA > titleB) return 1;
        return 0;
      });
    }

    if (filters.byGender !== "all") {
      if (filters.byGender === "male") {
        // get all the pools where pool.user.gender is male
        pools = pools.filter((pool) => pool.user.gender === "male");
      }

      if (filters.byGender === "female") {
        // get all the pools where pool.user.gender is female
        pools = pools.filter((pool) => pool.user.gender === "female");
      }
    }

    if (filters.isLive === "true") {
      // get all the pools where pool.is_active is 1
      pools = pools.filter((pool) => pool.is_active === 1);
    } else if (filters.isLive === "false") {
      // get all the pools where pool.is_active is 0
      pools = pools.filter((pool) => pool.is_active === 0);
    }
    return res.status(200).json(pools);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.sqlMessage });
  }
};

const getMyPools = async (req, res, next) => {
  try {
    let pools = await Pool.findMy(req.user.user_id);
    pools = pools[0];

    pools = await Promise.all(
      pools.map(async (pool) => {
        let prompts = await Prompt.findByPoolId(pool.pool_id);
        prompts = prompts[0];
        pool.prompts = prompts;
        return pool;
      })
    );

    return res.status(200).json(pools);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.sqlMessage });
  }
};

// edit pool
const editPool = async (req, res, next) => {
  try {
    const {
      title,
      category,
      meritRequired,
      discussionType,
      spectatorsAllowed,
      stance,
      guts,
      source,
      talktime,
      duration,
      peopleAllowed,
      prompts,
    } = req.body;

    let pool = await Pool.findById(req.params.id);
    pool = pool[0][0];

    if (pool) {
      if (pool.user_id !== req.user.user_id) {
        return res.status(400).json({ message: "Unauthorized" });
      }
      let updatedPool = await Pool.update(
        req.params.id,
        title,
        category,
        meritRequired,
        discussionType,
        spectatorsAllowed,
        stance,
        guts,
        source,
        talktime,
        duration,
        peopleAllowed
      );

      updatedPool = updatedPool[0][0];

      // update the prompts
      if (prompts !== undefined && prompts.length !== 0) {
        // get all the prompts for the pool

        for (let i = 0; i < prompts.length; i++) {
          let prompt = prompts[i];

          if (prompt.prompt_id === undefined) {
            res.status(400).json({ message: "Prompt id is required" });
          }

          await Prompt.update(
            prompt.prompt_id,
            prompt.text,
            prompt.time_minutes
          );
        }

        let updatedPrompts = await Prompt.findByPoolId(req.params.id);
        updatedPrompts = updatedPrompts[0];
        updatedPool.prompts = updatedPrompts;
      }
      return res.status(200).json({ message: "Pool updated", updatedPool });
    } else {
      return res.status(400).json({ message: "Pool not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.sqlMessage });
  }
};

const getPoolById = async (req, res, next) => {
  try {
    let pool = await Pool.findById(req.params.id);
    pool = pool[0][0];

    if (pool) {
      let prompts = await Prompt.findByPoolId(req.params.id);
      if (prompts) {
        prompts = prompts[0];
        pool.prompts = prompts;
        return res.status(200).json(pool);
      }
    } else {
      return res.status(400).json({ message: "Pool not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.sqlMessage });
  }
};
// delete pool

export { createPool, getPools, getMyPools, editPool, getPoolById };
