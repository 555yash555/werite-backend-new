import db from "../config/db.js";

class UpVotes {
  constructor(user_id, post_id) {
    this.user_id = user_id;
    this.post_id = post_id;
  }
  save() {
    let sql = `
    INSERT INTO upvotes
    (
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
    let sql = `
        SELECT * FROM upvotes 
        where user_id='${user_id}' and 
        post_id = '${post_id}';
    `;
    return db.execute(sql);
  }

  static getAllupvotes(post_id) {
    let sql = `SELECT * FROM upvotes WHERE post_id="${post_id}"`;
    return db.execute(sql);
  }

  static removeUpvoteFromPost(user_id, post_id) {
    let sql = `DELETE FROM upvotes WHERE user_id=${user_id} AND post_id=${post_id}`;
    return db.execute(sql);
  }
  static getByUser(user_id) {
    try {
      let sql = `SELECT * FROM upvotes WHERE user_id=${user_id}`;
      return db.execute(sql);
    } catch (err) {
      console.log(err);
    }
  }

  static getUpvotedPostsByUser(user_id) {
    try {
      let sql = `
      SELECT * FROM upvotes uv, posts p, users u
      WHERE uv.post_id = p.post_id AND uv.user_id = u.user_id   
      AND p.user_id=${user_id}`;
      return db.execute(sql);
    } catch (err) {
      console.log(err);
    }
  }
}

export default UpVotes;
