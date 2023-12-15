import db from "../config/db.js";

class Report {
  constructor(post_id, user_id, report_text) {
    this.post_id = post_id;
    this.user_id = user_id;
    this.report_text = report_text;
  }

  save() {
    let sql = `
    INSERT INTO reports
    (    
        post_id,
        user_id,
        report_text
    )
    VALUES(
        '${this.post_id}',
        '${this.user_id}',
        '${this.report_text}'
        )
    `;

    return db.execute(sql);
  }

  static findAll() {
    let sql = `
    SELECT * FROM reports;
    `;
    return db.execute(sql);
  }

  static findById(report_id) {
    let sql = `
    SELECT * FROM reports
    WHERE report_id = '${report_id}';
    `;
    return db.execute(sql);
  }

  static findByPostIdAndCount(post_id) {
    let sql = `SELECT *, COUNT(*) AS number_of_reports
    FROM reports
    WHERE post_id = '${post_id}'
    GROUP BY post_id;`;
    return db.execute(sql);
  }

  static findByPostId(post_id) {
    let sql = `
    SELECT * FROM reports
    WHERE post_id = '${post_id}';
    `;
    return db.execute(sql);
  }

  static findByUserId(user_id) {
    let sql = `
            SELECT * FROM reports
            WHERE user_id = '${user_id}';
            `;
    return db.execute(sql);
  }
}

export default Report;
