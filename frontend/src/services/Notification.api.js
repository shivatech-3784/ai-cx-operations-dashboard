import axiosInstance from "./axios";

export const fetchNotifications = async () => {
  const res = await axiosInstance.get("/notifications");
  return res.data.data;
};

export const markAsRead = async (notificationId) => {
  await axiosInstance.patch(`/notifications/${notificationId}/read`);
};
