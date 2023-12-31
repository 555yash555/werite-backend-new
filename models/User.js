import db from "../config/db.js";

class User {
  constructor(
    name,
    email,
    password,
    gender,
    mobile,
    username,
    is_active = 0,
    inCall,
    profile_pic,
    bio,
    type = "admin"
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.gender = gender;
    this.mobile = mobile;
    this.username = username;
    this.is_active = is_active;
    this.inCall = inCall;
    this.profile_pic = profile_pic;
    this.bio = bio;
    this.type = type;
  }

  save() {
    let d = new Date();
    let yyyy = d.getFullYear();
    let mm = d.getMonth() + 1;
    let dd = d.getDate();

    let createdAtDate = `${yyyy}-${mm}-${dd}`;

    let sql = `
    INSERT INTO users(
        name, 
        email, 
        password,
        gender, 
        mobile,
        created_at,
        username,
        merit,
        is_active,
        inCall,
        type  
    )
    VALUES(
      '${this.name}',
      '${this.email}',
      '${this.password}',
      '${this.gender ? this.gender : null}',
      '${this.mobile ? this.mobile : null}',
      '${createdAtDate}',
      '${this.username}',
      '50',
      '${this.is_active ? this.is_active : 1}',
      '0',
      '${this.type || "user"}'
    )
    `;

    return db.execute(sql);
  }

  static updateMerit(user_id, merit) {
    let sql = `UPDATE users SET merit = ${merit} WHERE user_id = ${user_id};`;

    return db.execute(sql);
  }

  static findOne(email) {
    let sql = `SELECT * FROM users WHERE email="${email}";`;
    return db.execute(sql);
  }

  static findByResetToken(token) {
    let sql = `SELECT * FROM users WHERE resetPasswordToken="${token}";`;
    console.log(sql);
    return db.execute(sql);
  }

  static matchPassword(user, password) {
    return user.password === password;
  }

  static findByUsername(username) {
    let sql = `SELECT user_id FROM users WHERE username="${username}";`;
    return db.execute(sql);
  }

  static findUserByUsername(username) {
    let sql = `SELECT * FROM users WHERE username="${username}";`;
    return db.execute(sql);
  }

  static findLikeUsersByUsername(username) {
    let sql = `SELECT * FROM users WHERE username LIKE "%${username}%";`;
    return db.execute(sql);
  }

  static findById(id) {
    try {
      let sql = `SELECT * FROM users WHERE user_id = ${id};`;
      return db.execute(sql);
    } catch (err) {
      console.log(err);
    }
  }

  static isUserInCall(user_id) {
    let sql = `SELECT * FROM users WHERE user_id = ${user_id} AND inCall != 0;`;

    return db.execute(sql);
  }

  static setUserCallStatus(user_id, inCall) {
    let sql = `UPDATE users SET inCall = ${inCall} WHERE user_id = ${user_id};`;

    return db.execute(sql);
  }

  static isCurrentPoolEmpty(inCall) {
    let sql = `SELECT * FROM users WHERE inCall=${inCall};`;

    return db.execute(sql);
  }
  static isUserActive(user_id) {
    let sql = `UPDATE users SET is_active = 1 WHERE user_id = ${user_id}`;
    return db.execute(sql);
  }
  static isUserNotActive(user_id) {
    let sql = `UPDATE users SET is_active = 0 WHERE user_id = ${user_id}`;
    return db.execute(sql);
  }
  static findUserPosts(user_id) {
    let sql = ` SELECT video_recordings.video_id,video_recordings.video_rec_url,users.user_id,users.username,pools.* from video_recordings INNER JOIN users ON video_recordings.user_id = users.user_id INNER JOIN pools ON video_recordings.pool_id = pools.pool_id WHERE users.user_id=${user_id}`;
    return db.execute(sql);
  }
  static addUserBio(user_id, bio) {
    let sql = `UPDATE users SET bio='${bio}' WHERE user_id=${user_id}`;
    return db.execute(sql);
  }
  static addProfileImage(user_id, url) {
    let sql = `UPDATE users SET profile_pic='${url}' WHERE user_id=${user_id}`;
    return db.execute(sql);
  }

  static findAll() {
    let sql = `SELECT * FROM users`;
    return db.execute(sql);
  }

  static setResetPasswordFields(user_id, token, expiration) {
    let sql = `UPDATE users SET resetPasswordToken='${token}', resetPasswordExpires='${expiration}' WHERE user_id=${user_id}`;

    return db.execute(sql);
  }

  static resetPassword(user_id, password) {
    let sql = `UPDATE users SET password='${password}', resetPasswordToken=null, resetPasswordExpires=null WHERE user_id=${user_id}`;

    return db.execute(sql);
  }
}

export default User;
