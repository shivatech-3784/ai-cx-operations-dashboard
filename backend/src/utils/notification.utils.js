import Notification from "../models/notification.model.js";
import { getIO } from "../socket/index.js";

export const createNotification = async ({
  user,
  ticketId,
  type,
  message,
}) => {
  const notification = await Notification.create({
    user,
    ticketId,
    type,
    message,
  });

  // 🔥 Emit real-time notification
  try {
    const io = getIO();
    io.to(user.toString()).emit("notification", notification);
  } catch (err) {
    console.warn("Socket emit failed (user offline)");
  }

  return notification;
};
