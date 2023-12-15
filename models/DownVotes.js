import db from "../config/db.js";

class DownVotes {
  constructor(user_id, post_id) {
    this.user_id = user_id;
    this.post_id = post_id;
  }
  save() {
    let sql = `
    INSERT INTO downvotes(
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
    let sql = `SELECT * FROM downvotes WHERE user_id="${user_id}" AND post_id="${post_id}"`;
    return db.execute(sql);
  }
  static getAlldownvotes(post_id) {
    let sql = `SELECT * FROM downvotes WHERE post_id="${post_id}"`;
    return db.execute(sql);
  }
  static removeDownvoteFromPost(user_id, post_id) {
    let sql = `DELETE FROM downvotes WHERE user_id=${user_id} AND post_id=${post_id}`;
    return db.execute(sql);
  }

  static getByUser(user_id) {
    try {
      let sql = `SELECT * FROM downvotes WHERE user_id=${user_id}`;
      return db.execute(sql);
    } catch (err) {
      console.log(err);
      return err;
    }
  }
  static getDownvotedPostsByUser(user_id) {
    try {
      let sql = `
      SELECT * FROM downvotes dv, posts p, users u
      WHERE dv.post_id = p.post_id AND dv.user_id = u.user_id   
      AND p.user_id=${user_id}`;
      return db.execute(sql);
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}

export default DownVotes;
