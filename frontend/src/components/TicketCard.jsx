import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { updateTicketStatus, assignTicket } from "../services/ticket.api";
import { fetchAgents } from "../services/user.api";

const TicketCard = ({ ticket }) => {
  const { user } = useAuth();

  const [status, setStatus] = useState(ticket.status);
  const [assignedTo, setAssignedTo] = useState(ticket.assignedTo?._id || "");
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);

  const canUpdateStatus = user?.role === "admin" || user?.role === "agent";

  /* =========================
     Fetch agents (ADMIN)
     ========================= */
  useEffect(() => {
    if (user?.role === "admin") {
      fetchAgents()
        .then(setAgents)
        .catch(() => console.error("Failed to fetch agents"));
    }
  }, [user]);

  /* =========================
     Status change
     ========================= */
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    try {
      setLoading(true);
      await updateTicketStatus(ticket._id, newStatus);
    } catch {
      setStatus(ticket.status);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     Assign agent (ADMIN)
     ========================= */
  const handleAssign = async (e) => {
    const agentId = e.target.value;
    setAssignedTo(agentId);

    try {
      await assignTicket(ticket._id, agentId);
    } catch {
      setAssignedTo(ticket.assignedTo?._id || "");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-gray-800">
            {ticket.title}
          </h3>
          <p className="text-sm text-gray-600">
            {ticket.description}
          </p>
        </div>

        {/* Status */}
        {canUpdateStatus && (
          <select
            value={status}
            onChange={handleStatusChange}
            disabled={loading}
            className="border rounded px-3 py-1 text-sm"
          >
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        )}
      </div>

      {/* ================= FOOTER ================= */}
      <div className="mt-4 flex justify-between items-center">
        {/* Severity */}
        <span
          className={`px-3 py-1 text-xs rounded-full font-medium
            ${
              ticket.severity === "high"
                ? "bg-red-100 text-red-700"
                : ticket.severity === "medium"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }`}
        >
          {ticket.severity.toUpperCase()}
        </span>

        {/* Assign */}
        {user?.role === "admin" && (
          <select
            value={assignedTo}
            onChange={handleAssign}
            className="border rounded px-3 py-1 text-sm w-40"
          >
            <option value="">Unassigned</option>
            {agents.map((agent) => (
              <option key={agent._id} value={agent._id}>
                {agent.username}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default TicketCard;
