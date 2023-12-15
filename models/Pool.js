import db from "../config/db.js";

class Pool {
  constructor(
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
    user_id,
    peopleAllowed
  ) {
    this.title = title;
    this.category = category;
    this.meritRequired = meritRequired;
    this.discussionType = discussionType;
    this.spectatorsAllowed = spectatorsAllowed;
    this.stance = stance;
    this.guts = guts;
    this.source = source;
    this.duration = duration;
    this.isActive = isActive || 0;
    this.user_id = user_id;
    this.peopleAllowed = peopleAllowed;
  }

  save() {
    let sql = `
    INSERT INTO pools
    (   
      title, 
      category, 
      merit_required,
      discussion_type, 
      spectators_allowed, 
      stance,
      guts, 
      source,  
      duration, 
      is_active,
      user_id,
      people_allowed
    )
    VALUES(
      '${this.title}',
      '${this.category}',
      '${this.meritRequired}',
      '${this.discussionType}',
      '${this.spectatorsAllowed}',
      '${this.stance}',
      '${this.guts}',
      '${this.source}',
      '${this.duration}',
      '${this.isActive}',
      '${this.user_id}',
      '${this.peopleAllowed}' 
    );
    `;

    return db.execute(sql);
  }

  static findAll(user_id) {
    let sql = `SELECT * FROM pools WHERE user_id!= ${user_id} ORDER BY  created_at DESC;`;

    return db.execute(sql);
  }

  static findMy(user_id) {
    let sql = `SELECT * FROM pools WHERE user_id= ${user_id} ORDER BY created_at DESC;`;

    return db.execute(sql);
  }

  static findById(pool_id) {
    let sql = `SELECT * FROM pools WHERE pool_id= ${pool_id};`;

    return db.execute(sql);
  }

  static isUserHostOfPool(user_id, pool_id) {
    let sql = `SELECT * FROM pools WHERE pool_id= ${pool_id} and user_id= ${user_id};`;
    return db.execute(sql);
  }
  static setActiveStatusOfPool(pool_id, isactive) {
    let sql = `UPDATE pools SET is_active = ${isactive} WHERE pool_id=${pool_id};`;
    return db.execute(sql);
  }

  static isCurrentPoolActive(pool_id) {
    let sql = `SELECT * FROM pools WHERE is_active = 1 AND pool_id="${pool_id}";`;
    return db.execute(sql);
  }

  static isUserAllowedToJoinPool(pool_id, user_id) {
    let sql = `SELECT * FROM pools_requests WHERE status="accepted" AND user_id="${user_id}" AND pool_id="${pool_id}";`;
    return db.execute(sql);
  }

  static setPoolNotification(pool_id) {
    let sql = `UPDATE pools SET noti_sent= 1 WHERE pool_id=${pool_id};`;
    return db.execute(sql);
  }

  static async update(
    pool_id,
    title = undefined,
    category = undefined,
    merit_required = undefined,
    discussionType = undefined,
    spectators_allowed = undefined,
    stance = undefined,
    guts = undefined,
    source = undefined,
    talktime = undefined,
    duration = undefined,
    peopleAllowed = undefined
  ) {
    let pool = `select * from pools where pool_id = ${pool_id}`;
    pool = await db.execute(pool);
    pool = pool[0][0];

    if (pool) {
      let sql = `UPDATE pools SET title = '${
        title || pool.title
      }', category = '${
        category ? category : pool.category
      }', merit_required = '${
        merit_required ? merit_required : pool.merit_required
      }', discussion_type = '${
        discussionType || pool.discussionType
      }', spectators_allowed = '${
        spectators_allowed || pool.spectators_allowed
      }', stance = '${stance || pool.stance}', guts = '${
        guts || pool.guts
      }', source = '${source || pool.source}', talktime = '${
        talktime || pool.talktime
      }', duration = '${duration || pool.duration}', people_allowed = '${
        peopleAllowed || pool.people_allowed
      }' WHERE pool_id = ${pool_id};`;
      await db.execute(sql);
      pool = `select * from pools where pool_id = ${pool_id}`;
      return db.execute(pool);
    }
  }
}

export default Pool;
