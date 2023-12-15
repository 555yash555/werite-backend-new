import Report from "../models/Report.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

const reportPost = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const post_id = req.params.id;
    const report_text = req.body.report_text;
    let post = await Post.findById(post_id);
    post = post[0][0];
    if (!post) {
      return res.status(400).json({ message: "post not found" });
    }
    let user = await User.findById(user_id);
    user = user[0][0];

    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    delete user.password;
    let report = await Report.findByPostId(post_id);
    report = report[0][0];
    if (report) {
      return res.status(400).json({ message: "user already reported" });
    }
    report = new Report(post_id, user_id, report_text);
    await report.save();
    return res.status(200).json({ message: "user reported the post" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.sqlMessage });
  }
};

const getAllReports = async (req, res, next) => {
  try {
    let admin = await User.findById(req.user.user_id);
    admin = admin[0][0];
    if (admin) {
      if (admin.type !== "admin") {
        return res.status(403).json({ message: "Unauthorized" });
      }
    }
  } catch (error) {
    if (error.sqlMessage) {
      return res.status(400).json({ message: error.sqlMessage });
    }
    return res.status(400).json({ message: error });
  }

  try {
    let reports = await Report.findAll();
    reports = reports[0];
    reports = Object.values(reports);
    reports = await Promise.all(
      reports.map(async (report) => {
        let post = await Post.findById(report.post_id);
        post = post[0][0];
        if (!post) {
          return res.status(400).json({ message: "post not found" });
        }
        let post_user = await User.findById(post.user_id);
        post_user = post_user[0][0];
        if (!post_user) {
          return res.status(400).json({ message: "post user not found" });
        }
        delete post_user.password;
        post.user = post_user;
        report.post = post;
        let user = await User.findById(report.user_id);
        user = user[0][0];
        if (!user) {
          return res.status(400).json({ message: "user not found" });
        }
        delete user.password;
        report.user = user;
        return report;
      })
    );
    return res.status(200).json({ reports });
  } catch (error) {
    console.log(error);
    if (error.sqlMessage) {
      return res.status(400).json({ message: error.sqlMessage });
    }
    return res.status(400).json({ message: error });
  }
};

const getReport = async (req, res, next) => {
  try {
    let admin = await User.findById(req.user.user_id);
    admin = admin[0][0];
    if (admin) {
      if (admin.type !== "admin") {
        return res.status(403).json({ message: "Unauthorized" });
      }
    }
  } catch (error) {
    if (error.sqlMessage) {
      return res.status(400).json({ message: error.sqlMessage });
    }
    return res.status(400).json({ message: error });
  }

  let report_id = req.params.report_id;
  try {
    let report = await Report.findById(report_id);
    report = report[0][0];
    if (!report) {
      return res.status(400).json({ message: "report not found" });
    }
    let post = await Post.findById(report.post_id);
    post = post[0][0];

    if (!post) {
      return res.status(400).json({ message: "post not found" });
    }
    let post_user = await User.findById(post.user_id);
    post_user = post_user[0][0];
    if (!post_user) {
      return res.status(400).json({ message: "post user not found" });
    }
    delete post_user.password;
    post.user = post_user;
    report.post = post;
    let user = await User.findById(report.user_id);
    user = user[0][0];
    report.user = user;
    return res.status(200).json({ report });
  } catch (error) {
    console.log(error);
    if (error.sqlMessage) {
      return res.status(400).json({ message: error.sqlMessage });
    }
    return res.status(400).json({ message: error });
  }
};

export { reportPost, getAllReports, getReport };
