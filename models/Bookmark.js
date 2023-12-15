import db from "../config/db.js";

class Bookmarks {
  constructor(user_id, post_id) {
    this.user_id = user_id;
    this.post_id = post_id;
  }

  save() {
    let sql = `
    INSERT INTO bookmarks(
      user_id,
      post_id
    )
    VALUES(
      '${this.user_id}',
      '${this.post_id}'
  );`;

    return db.execute(sql);
  }
  static removeBookmarkFromPost(user_id, post_id) {
    let sql = `
    DELETE FROM bookmarks
    WHERE user_id = '${user_id}'
    AND post_id = '${post_id}'
    `;
    return db.execute(sql);
  }

  static getByUserAndPost(user_id, post_id) {
    let sql = `
    SELECT * FROM bookmarks
    WHERE user_id = '${user_id}'
    AND post_id = '${post_id}'
    `;
    return db.execute(sql);
  }
  static getByUser(user_id) {
    let sql = `
    SELECT * FROM bookmarks
    WHERE user_id = '${user_id}'
    `;
    return db.execute(sql);
  }

  static getBookmarkedPostsByUser(user_id) {
    try {
      let sql = `
      SELECT * FROM bookmarks b, posts p, users u
      WHERE b.post_id = p.post_id AND b.user_id = u.user_id   
      AND p.user_id=${user_id}`;
      return db.execute(sql);
    } catch (err) {
      console.log(err);
      return err;
    }
  }
  static getAllBookmarks(post_id) {
    try {
      let sql = `
      SELECT * FROM bookmarks b, posts p, users u
      WHERE b.post_id = p.post_id AND b.user_id = u.user_id   
      AND b.post_id=${post_id}`;
      return db.execute(sql);
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}

export default Bookmarks;
