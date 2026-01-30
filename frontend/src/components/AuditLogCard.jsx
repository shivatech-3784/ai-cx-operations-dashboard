const AuditLogCard = ({ log }) => {
  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      {/* Action */}
      <div className="flex justify-between items-center mb-1">
        <span className="font-semibold text-gray-800">
          {log.action.replace("_", " ")}
        </span>
        <span className="text-xs text-gray-400">
          {new Date(log.createdAt).toLocaleString()}
        </span>
      </div>

      {/* Ticket */}
      {log.ticketId && (
        <p className="text-sm text-gray-700">
          <span className="font-medium">Ticket:</span>{" "}
          {log.ticketId.title}
        </p>
      )}

      {/* Change */}
      <p className="text-sm text-gray-600">
        {log.oldValue} → {log.newValue}
      </p>

      {/* Reason */}
      {log.reason && (
        <p className="text-sm text-gray-500 mt-1">
          Reason: {log.reason}
        </p>
      )}

      {/* Actor */}
      {log.performedBy && (
        <p className="text-xs text-gray-400 mt-2">
          By: {log.performedBy.username} ({log.performedBy.role})
        </p>
      )}
    </div>
  );
};

export default AuditLogCard;
