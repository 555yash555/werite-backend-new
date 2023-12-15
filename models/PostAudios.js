import db from "../config/db.js";

class PostAudios {
  constructor(audio_url, pool_id) {
    this.audio_url = audio_url;
    this.pool_id = pool_id;
  }
  save() {
    let sql = `
    INSERT INTO post_audios(
        audio_url,
        pool_id,
    )
    VALUES(
        '${this.audio_url}',
        '${this.pool_id}',
    )
    `;
    return db.execute(sql);
  }

  static findAll() {
    let sql = `
    SELECT * FROM post_audios
    `;
    return db.execute(sql);
  }

  static findByPostId(post_id) {
    let sql = `
    SELECT * FROM post_audios
    WHERE post_id = '${post_id}'
    `;
    return db.execute(sql);
  }

  static deleteByPostId(post_id) {
    let sql = `
    DELETE FROM post_audios
    WHERE post_id = '${post_id}';
    `;
    return db.execute(sql);
  }
}

export default PostAudios;
