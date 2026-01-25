import Notification from "../models/notification.model.js";

export const createNotification = async ({
  user,
  ticketId,
  type,
  message,
}) => {
  return Notification.create({
    user,
    ticketId,
    type,
    message,
  });
};
