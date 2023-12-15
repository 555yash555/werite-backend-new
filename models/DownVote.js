import db from "../config/db.js";

class DownVotes {
  constructor(user_id, post_id) {
    this.user_id = user_id;
    this.post_id = post_id;
  }
  save() {
    let sql = `
    INSERT INTO dislikes(
        user_id,
        post_id
    )
    VALUES(
        '${this.user_id}',
        '${this.post_id}'
    )
    `;
    return db.execute(sql);
  }

  static findById(user_id, post_id) {
    let sql = `SELECT * FROM dislikes WHERE user_id="${user_id}" AND post_id="${post_id}"`;
    return db.execute(sql);
  }
  static getAllDisLikes(post_id) {
    let sql = `SELECT * FROM dislikes WHERE post_id="${post_id}"`;
    return db.execute(sql);
  }
  static removeDislikeFromPost(user_id, post_id) {
    let sql = `DELETE FROM dislikes WHERE user_id=${user_id} AND post_id=${post_id}`;
    return db.execute(sql);
  }

  static getByUser(user_id) {
    try {
      let sql = `SELECT * FROM dislikes WHERE user_id=${user_id}`;
      return db.execute(sql);
    } catch (err) {
      console.log(err);
    }
  }
}

export default DownVotes;
