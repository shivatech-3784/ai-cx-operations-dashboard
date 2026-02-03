const formatTime = (date) => {
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatAction = (action) => {
  return action
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const getActionColor = (action) => {
  switch (action) {
    case "SLA_ESCALATED":
      return "text-red-600";
    case "SLA_OVERRIDE":
      return "text-amber-600";
    case "SEVERITY_OVERRIDE":
      return "text-purple-600";
    case "TICKET_ASSIGNED":
      return "text-blue-600";
    default:
      return "text-gray-700";
  }
};

const AuditLogCard = ({ log }) => {
  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-1">
        <span
          className={`font-semibold ${getActionColor(log.action)}`}
        >
          {formatAction(log.action)}
        </span>

        <span className="text-xs text-gray-400">
          {formatTime(log.createdAt)}
        </span>
      </div>

      {/* ================= TICKET ================= */}
      {log.ticketId && (
        <p className="text-sm text-gray-700 mt-1">
          <span className="font-medium">Ticket:</span>{" "}
          {log.ticketId.title}
        </p>
      )}

      {/* ================= CHANGE ================= */}
      <p className="text-sm text-gray-600 mt-1">
        <span className="font-medium text-gray-500">
          Change:
        </span>{" "}
        <span className="text-gray-800">{log.oldValue}</span>{" "}
        <span className="mx-1">→</span>
        <span className="text-gray-800">{log.newValue}</span>
      </p>

      {/* ================= REASON ================= */}
      {log.reason && (
        <p className="text-sm text-gray-500 mt-1">
          <span className="font-medium">Reason:</span>{" "}
          {log.reason}
        </p>
      )}

      {/* ================= ACTOR ================= */}
      {log.performedBy && (
        <p className="text-xs text-gray-400 mt-2">
          By:{" "}
          <span className="font-medium text-gray-600">
            {log.performedBy.username}
          </span>{" "}
          ({log.performedBy.role})
        </p>
      )}
    </div>
  );
};

export default AuditLogCard;
