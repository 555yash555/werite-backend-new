import db from "../config/db.js";

class Block {
  constructor(user_id_1, user_id_2) {
    this.user_id_1 = user_id_1;
    this.user_id_2 = user_id_2;
  }

  save() {
    // user_id_1 is the user who blocked user_id_2
    let sql = `
    INSERT INTO block(
      user_id_1,
      user_id_2
    )
    VALUES(
      '${this.user_id_1}',
      '${this.user_id_2}'
  );`;

    return db.execute(sql);
  }
  static unblockUser(user_id_1, user_id_2) {
    // user_id_1 is the user who is unblocking user_id_2
    let sql = `
    DELETE FROM block
    WHERE user_id_1 = '${user_id_1}'
    AND user_id_2 = '${user_id_2}'
    `;
    return db.execute(sql);
  }

  static findAll() {
    let sql = `
    SELECT * FROM block;
    `;
    return db.execute(sql);
  }

  static findById(user_id_1, user_id_2) {
    let sql = `
    SELECT * FROM block
    WHERE user_id_1 = '${user_id_1}'
    AND user_id_2 = '${user_id_2}';
    `;
    return db.execute(sql);
  }

  static getIdsBlockingUser(user_id) {
    let sql = `
    SELECT user_id_1 FROM block
    WHERE user_id_2 = '${user_id}';
    `;
    return db.execute(sql);
  }

  static getBlockedUsers(user_id) {
    let sql = `
    SELECT * FROM users
    WHERE user_id IN (
      SELECT user_id_2 FROM block
      WHERE user_id_1 = '${user_id}'
    );
    `;

    return db.execute(sql);
  }
}

export default Block;
