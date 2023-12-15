import db from "../config/db.js";

class VideoRecording {
  constructor(video_rec_url, user_id, pool_id, source_link) {
    this.video_rec_url = video_rec_url;
    this.user_id = user_id;
    this.pool_id = pool_id;
    this.source_link = source_link;
  }
  save() {
    let sql = `
    INSERT INTO video_recordings(
        video_rec_url,
        user_id,
        pool_id,
        source_link
    )
    VALUES(
        '${this.video_rec_url}',
        '${this.user_id}',
        '${this.pool_id}',
        '${this.source_link}'
    )
    `;
    return db.execute(sql);
  }
  static findAllVideoRec() {
    let sql = `SELECT * FROM video_recordings`;
    return db.execute(sql);
  }

  static findById(video_id) {
    try {
      let sql = `SELECT * FROM video_recordings WHERE video_id="${video_id}"`;
      return db.execute(sql);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default VideoRecording;
