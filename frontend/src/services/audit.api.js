import axiosInstance from "./axios";

// ADMIN: fetch audit logs with filters
export const fetchAuditLogs = async (filters = {}) => {
  const res = await axiosInstance.get(
    "/audit-logs",
    { params: filters }
  );
  return res.data.data;
};

// OPTIONAL: per-ticket audit logs (if you add later)
export const fetchTicketAuditLogs = async (ticketId) => {
  const res = await axiosInstance.get(
    `/audit-logs?ticket=${ticketId}`
  );
  return res.data.data;
};
