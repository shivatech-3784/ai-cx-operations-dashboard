import express from "express";
import {
  getMyNotifications,
  markNotificationAsRead,
} from "../controllers/notification.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * Get logged-in user's notifications
 */
router.get("/", verifyJWT, getMyNotifications);

/**
 * Mark notification as read
 */
router.patch("/:id/read", verifyJWT, markNotificationAsRead);

export default router;
