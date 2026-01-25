import Notification from "../models/notification.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";

/**
 * Get notifications for logged-in user
 */
export const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .populate("ticketId", "title severity status")
    .sort({ createdAt: -1 });

  return res.json(
    new apiResponse(200, notifications, "Notifications fetched")
  );
});

/**
 * Mark notification as read
 */
export const markNotificationAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    throw new apiError(404, "Notification not found");
  }

  // Security: user can update only their notifications
  if (notification.user.toString() !== req.user._id.toString()) {
    throw new apiError(403, "Not authorized");
  }

  notification.isRead = true;
  await notification.save();

  return res.json(
    new apiResponse(200, null, "Notification marked as read")
  );
});
