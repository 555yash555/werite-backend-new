import e from "cors";
import db from "../config/db.js";

class Post {
  constructor(title, description, user_id, source_link = "") {
    this.title = title;
    this.description = description;
    this.user_id = user_id;
    this.source_link = source_link;
  }

  save() {
    let sql = `
    INSERT INTO posts(
        title,
        description,
        user_id,
        source_link
    )
    VALUES(
        '${this.title}',
        '${this.description}',
        '${this.user_id}',
        '${this.source_link}'
    );
    `;

    return db.execute(sql);
  }

  static findAll() {
    let sql = `
    SELECT * FROM posts
    `;
    return db.execute(sql);
  }

  static findById(post_id) {
    let sql = `
    SELECT * FROM posts
    WHERE post_id = '${post_id}';
    `;

    return db.execute(sql);
  }

  static deleteById(post_id) {
    let sql = `
    DELETE FROM posts
    WHERE post_id = '${post_id}';
    `;

    return db.execute(sql);
  }

  static findByUserId(user_id) {
    try {
      let sql = `
      SELECT * FROM posts p
      WHERE p.user_id = '${user_id}';`;
      console.log(sql);
      return db.execute(sql);
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}

export default Post;
