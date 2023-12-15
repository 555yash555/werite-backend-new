import express from "express";
import multer from "multer";
const upload = multer();
const router = express.Router();
import {
  getAllUsers,
  getAllPools,
  getUser,
  getPool,
} from "../controllers/adminController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { getAllReports, getReport } from "../controllers/reportController.js";
router.route("/users").get(protect, getAllUsers);
router.route("/users/:user_id").get(protect, getUser);
router.route("/pools").get(protect, getAllPools);
router.route("/pools/:pool_id").get(protect, getPool);
router.route("/reports").get(protect, getAllReports);
router.route("/reports/:report_id").get(protect, getReport);

export default router;
