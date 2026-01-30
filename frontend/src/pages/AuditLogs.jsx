import { useEffect, useState } from "react";
import { fetchAuditLogs } from "../services/audit.api";
import AuditLogCard from "../components/AuditLogCard";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [action, setAction] = useState("");
  const [range, setRange] = useState("");

  // Fetch logs using API layer
  const loadAuditLogs = async () => {
    try {
      setLoading(true);

      const filters = {};
      if (action) filters.action = action;
      if (range) filters.range = range;

      const data = await fetchAuditLogs(filters);
      setLogs(data);
    } catch (err) {
      console.error("Failed to fetch audit logs", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on load + when filters change
  useEffect(() => {
    loadAuditLogs();
  }, [action, range]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Audit Logs</h1>

      {/* ================= FILTER BAR ================= */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm"
        >
          <option value="">All Actions</option>
          <option value="SEVERITY_OVERRIDE">Severity Override</option>
          <option value="SLA_ESCALATED">SLA Escalated</option>
          <option value="SLA_OVERRIDE">SLA Override</option>
        </select>

        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm"
        >
          <option value="">All Time</option>
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
        </select>
      </div>

      {/* ================= LOG LIST ================= */}
      {loading ? (
        <p className="text-gray-500">Loading audit logs...</p>
      ) : logs.length === 0 ? (
        <p className="text-gray-500">No audit logs found.</p>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <AuditLogCard key={log._id} log={log} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
