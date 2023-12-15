import db from "../config/db.js";

class Chats {
  constructor(user_first, user_second, latest_message_id = undefined) {
    this.user_first = user_first;
    this.user_second = user_second;
    this.latest_message_id = latest_message_id;
  }

  save() {
    let sql = `INSERT INTO chats(
        user_first, user_second, latest_message_id
    )
    VALUES(
        '${this.user_first}',
        '${this.user_second}',
        '${this.latest_message_id || -1}'
    )`;
    return db.execute(sql);
  }

  static findByUsers(user_first, user_second) {
    let sql = `SELECT * FROM chats WHERE (user_first = '${user_first}' AND user_second = '${user_second}') OR (user_first = '${user_second}' AND user_second = '${user_first}');`;
    console.log(sql);
    return db.execute(sql);
  }

  static findByUser(user_id) {
    let sql = `SELECT * FROM chats WHERE user_first = '${user_id}' OR user_second = '${user_id}'`;
    return db.execute(sql);
  }

  static updateLatestMessageId(chat_id, message_id) {
    let sql = `UPDATE chats SET latest_message_id = '${message_id}' WHERE chat_id = '${chat_id}'`;
    return db.execute(sql);
  }

  static findById(chat_id) {
    let sql = `SELECT * FROM chats WHERE chat_id = '${chat_id}'`;
    return db.execute(sql);
  }
}

export default Chats;
