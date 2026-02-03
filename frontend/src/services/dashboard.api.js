import axiosInstance from "./axios";

/* =========================
   Fetch dashboard stats
   ========================= */
export const fetchDashboardStats = async () => {
  const res = await axiosInstance.get("/dashboard/stats");
  return res.data.data;
};
