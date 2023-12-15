import db from "../config/db.js";

class PostVideos {
  constructor(video_url, post_id, pool_id = -1) {
    this.video_url = video_url;
    this.post_id = post_id;
    this.pool_id = pool_id;
  }
  save() {
    let sql = `
    INSERT INTO post_videos(
        video_url,
        post_id,
        pool_id
    )
    VALUES(
        '${this.video_url}',
        '${this.post_id}',
        '${this.pool_id}'
    )
    `;
    return db.execute(sql);
  }
  static findByPostId(post_id) {
    let sql = `
    SELECT * FROM post_videos
    WHERE post_id = '${post_id}';
    `;
    return db.execute(sql);
  }

  static deleteByPostId(post_id) {
    let sql = `
    DELETE FROM post_videos
    WHERE post_id = '${post_id}';
    `;
    return db.execute(sql);
  }
}

export default PostVideos;
