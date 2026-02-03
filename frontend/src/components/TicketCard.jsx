import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import {
  updateTicketStatus,
  assignTicket,
  overrideSeverity,
  overrideSla,
} from "../services/ticket.api";
import { fetchAgents } from "../services/user.api";

const TicketCard = ({ ticket, onTicketUpdate }) => {
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";
  const canUpdateStatus = isAdmin || user?.role === "agent";

  const [status, setStatus] = useState(ticket.status);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 SLA override state (THIS WAS MISSING BEFORE)
  const [showSlaInput, setShowSlaInput] = useState(false);
  const [slaInput, setSlaInput] = useState("");

  /* =========================
     Sync status when ticket updates
     ========================= */
  useEffect(() => {
    setStatus(ticket.status);
  }, [ticket.status]);

  /* =========================
     Fetch agents (ADMIN)
     ========================= */
  useEffect(() => {
    if (isAdmin) {
      fetchAgents()
        .then(setAgents)
        .catch(() => console.error("Failed to fetch agents"));
    }
  }, [isAdmin]);

  /* =========================
     Status change
     ========================= */
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    try {
      setLoading(true);
      const updated = await updateTicketStatus(ticket._id, newStatus);
      onTicketUpdate(updated);
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
    if (!agentId) return;

    try {
      const updated = await assignTicket(ticket._id, agentId);
      onTicketUpdate(updated);
    } catch {
      console.error("Assignment failed");
    }
  };

  /* =========================
     Override Severity (ADMIN)
     ========================= */
  const handleSeverityOverride = async (e) => {
    const severity = e.target.value;

    try {
      const updated = await overrideSeverity(ticket._id, severity);
      onTicketUpdate(updated);
    } catch {
      console.error("Severity override failed");
    }
  };

  /* =========================
     Override SLA (ADMIN) ✅ FINAL
     ========================= */
  const handleSlaOverride = async () => {
    if (!slaInput) {
      alert("Please select SLA date & time");
      return;
    }

    try {
      // Convert datetime-local → ISO UTC
      const localDate = new Date(slaInput);
      const isoDate = new Date(
        localDate.getTime() - localDate.getTimezoneOffset() * 60000
      ).toISOString();

      const updated = await overrideSla(ticket._id, {
        slaDeadline: isoDate,
        reason: "Manual SLA override by admin",
      });

      onTicketUpdate(updated);
      setShowSlaInput(false);
      setSlaInput("");
    } catch (err) {
      console.error("SLA override failed", err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition border p-6">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-gray-800">
            {ticket.title}
          </h3>

          <p className="text-sm text-gray-600">{ticket.description}</p>

          {/* AI Summary */}
          {ticket.aiSummary && (
            <p className="mt-2 text-xs italic text-gray-500 bg-gray-50 px-3 py-2 rounded">
              🤖 {ticket.aiSummary}
            </p>
          )}

          {/* SLA display */}
          {ticket.slaDeadline && (
            <p className="text-xs text-gray-500 mt-1">
              ⏱ SLA: {new Date(ticket.slaDeadline).toLocaleString()}
            </p>
          )}
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
      <div className="mt-4 flex flex-wrap gap-4 justify-between items-center">
        {/* Severity badge */}
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

        <div className="flex gap-3 items-center">
          {/* Assign */}
          {isAdmin && (
            <select
              value={ticket.assignedTo?._id || ""}
              onChange={handleAssign}
              className="border rounded px-3 py-1 text-sm"
            >
              <option value="">Unassigned</option>
              {agents.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.username}
                </option>
              ))}
            </select>
          )}

          {/* Severity Override */}
          {isAdmin && (
            <select
              value={ticket.severity}
              onChange={handleSeverityOverride}
              className="border rounded px-2 py-1 text-xs"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          )}

          {/* SLA Override */}
          {isAdmin && (
            <div className="flex items-center gap-2">
              {!showSlaInput ? (
                <button
                  onClick={() => setShowSlaInput(true)}
                  className="text-xs px-3 py-1 border rounded hover:bg-gray-100"
                >
                  Override SLA
                </button>
              ) : (
                <>
                  <input
                    type="datetime-local"
                    value={slaInput}
                    onChange={(e) => setSlaInput(e.target.value)}
                    className="border rounded px-2 py-1 text-xs"
                  />
                  <button
                    onClick={handleSlaOverride}
                    className="text-xs px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setShowSlaInput(false);
                      setSlaInput("");
                    }}
                    className="text-xs px-2 py-1 text-gray-500"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketCard;

