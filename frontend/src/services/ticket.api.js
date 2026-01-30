import axiosInstance from "./axios";

/* =========================
   Fetch all tickets
   ========================= */
export const fetchTickets = async () => {
  const res = await axiosInstance.get("/tickets/get");
  return res.data.data;
};

/* =========================
   Create ticket
   ========================= */
export const createTicket = async (payload) => {
  const res = await axiosInstance.post(
    "/tickets/create",
    payload
  );
  return res.data.data;
};

/* =========================
   Update ticket status
   ========================= */
export const updateTicketStatus = async (
  ticketId,
  status
) => {
  const res = await axiosInstance.patch(
    `/tickets/${ticketId}/status`,
    { status }
  );
  return res.data.data;
};

/* =========================
   Assign ticket (ADMIN)
   ========================= */
export const assignTicket = async (
  ticketId,
  assignedTo
) => {
  const res = await axiosInstance.patch(
    `/tickets/${ticketId}/assign`,
    { assignedTo }
  );
  return res.data.data;
};
