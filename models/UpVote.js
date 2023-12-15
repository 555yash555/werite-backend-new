import db from "../config/db.js";

class UpVotes {
  constructor(user_id, video_id) {
    this.user_id = user_id;
    this.video_id = video_id;
  }
  save() {
    let sql = `
    INSERT INTO likes
    (
        user_id,
        video_id
    )
    VALUES(
        '${this.user_id}',
        '${this.video_id}'
        )  
    `;
    return db.execute(sql);
  }

  static getAllLikes(video_id) {
    let sql = `SELECT * FROM likes WHERE video_id="${video_id}"`;
    return db.execute(sql);
  }

  static removeLikeFromVideo(user_id, video_id) {
    let sql = `DELETE FROM likes WHERE user_id=${user_id} AND video_id=${video_id}`;
    return db.execute(sql);
  }
  static getByUser(user_id) {
    try {
      let sql = `SELECT * FROM likes WHERE user_id=${user_id}`;
      return db.execute(sql);
    } catch (err) {
      console.log(err);
    }
  }
}

export default UpVotes;
