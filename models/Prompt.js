import db from "../config/db.js";

class Prompt {
  constructor(text, pool_id, timeMinutes) {
    this.text = text;
    this.pool_id = pool_id;
    this.timeMinutes = timeMinutes;
  }

  save() {
    let sql = `
    INSERT INTO prompts
    (    
      text,
      pool_id,
      timeMinutes
    )
    VALUES(
      '${this.text}',
      '${this.pool_id}',
      '${this.timeMinutes}'
    )
    `;

    return db.execute(sql);
  }

  static findByPoolId(pool_id) {
    let sql = `
    SELECT * FROM prompts
    WHERE pool_id = '${pool_id}'
    `;

    return db.execute(sql);
  }

  static findById(prompt_id) {
    let sql = `
    SELECT * FROM prompts
    WHERE prompt_id = '${prompt_id}';
    `;
    return db.execute(sql);
  }

  static async update(prompt_id, text = undefined, time_minutes = undefined) {
    let prompt = `SELECT * FROM prompts WHERE prompt_id = '${prompt_id}';`;
    prompt = await db.execute(prompt);
    prompt = prompt[0][0];

    let newTime = prompt.timeMinutes;
    let newText = prompt.text;

    if (time_minutes != undefined) {
      newTime = time_minutes;
    }

    if (text !== undefined) {
      newText = text;
    }

    if (prompt) {
      let sql = `UPDATE prompts SET text = '${newText}',timeMinutes = '${newTime}' WHERE prompt_id = '${prompt_id}'
      ;`;

      await db.execute(sql);

      prompt = `SELECT * FROM prompts WHERE prompt_id = '${prompt_id}';`;
      return db.execute(prompt);
    }
  }
}
export default Prompt;
