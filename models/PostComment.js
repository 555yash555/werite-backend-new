import db from "../config/db.js";

class PostComments {
  constructor(post_id, user_id, comment, reply_of_comment_id) {
    this.post_id = post_id;
    this.reply_of_comment_id = reply_of_comment_id || undefined;
    this.user_id = user_id;
    this.comment = comment;
  }
  async save() {
    let sql;
    if (this.reply_of_comment_id !== undefined) {
      sql = `INSERT INTO post_comments 
        (
          post_id,
          user_id,
          comment,
          reply_of_comment_id
        )
        values(
            '${this.post_id}',
            '${this.user_id}',
            '${this.comment}',
            '${this.reply_of_comment_id}'
        )`;
    } else {
      sql = `INSERT INTO post_comments(post_id,user_id,comment)values(${this.post_id},${this.user_id},"${this.comment}")`;
    }
    return db.execute(sql);
  }

  static findById(comment_id) {
    let sql = `SELECT * FROM post_comments WHERE comment_id=${comment_id}`;
    return db.execute(sql);
  }

  static findAllComments(post_id) {
    let sql = `SELECT * FROM post_comments where post_id=${post_id} ORDER BY comment_id DESC`;
    return db.execute(sql);
  }

  static findAllParentComment(post_id) {
    let sql = `SELECT * FROM post_comments where post_id=${post_id} AND reply_of_comment_id IS NULL ORDER BY comment_id DESC`;
    return db.execute(sql);
  }

  static findAllChildComment(reply_of_comment_id, post_id) {
    let sql = `SELECT * FROM post_comments where reply_of_comment_id=${reply_of_comment_id}  AND post_id=${post_id} ORDER BY comment_id DESC`;
    return db.execute(sql);
  }
}

export default PostComments;
