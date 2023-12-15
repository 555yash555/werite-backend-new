import db from "../config/db.js";

class Message {
  constructor(sender_id, chat_id, message, read = 0) {
    this.sender_id = sender_id;
    this.chat_id = chat_id;
    this.message = message;
    this.read = read;
  }

  save() {
    let sql = `INSERT INTO messages(sender_id, chat_id, message, \`read\` )
    VALUES(
        '${this.sender_id}',
        '${this.chat_id}',
        '${this.message}',
        '${this.read}'
    )`;

    return db.execute(sql);
  }

  static findById(message_id) {
    let sql = `SELECT * FROM messages WHERE message_id = '${message_id}'`;
    return db.execute(sql);
  }
  static findByChat(chat_id) {
    let sql = `SELECT * FROM messages WHERE chat_id = '${chat_id}'`;
    return db.execute(sql);
  }
}

export default Message;
