import db from "../config/db.js";

class PostImages {
  constructor(image_url, post_id) {
    this.image_url = image_url;
    this.post_id = post_id;
  }
  async save() {
    let sql = `
    INSERT INTO post_images(
        image_url,
        post_id
    )
    VALUES(
        '${this.image_url}',
        '${this.post_id}'
    );
    `;
    return db.execute(sql);
  }
  static findById(image_id) {
    let sql = `
    SELECT * FROM post_images
    WHERE post_image_id = '${image_id}'
    `;
    return db.execute(sql);
  }

  static findAll() {
    let sql = `
    SELECT * FROM post_images
    `;
    return db.execute(sql);
  }
  static findByPostId(post_id) {
    let sql = `
    SELECT * FROM post_images
    WHERE post_id = '${post_id}';
    `;

    return db.execute(sql);
  }

  static deleteByPostId(post_id) {
    let sql = `
    DELETE FROM post_images
    WHERE post_id = '${post_id}';
    `;
    return db.execute(sql);
  }
}

export default PostImages;
