import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import axiosInstance from "../services/axios";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get("/dashboard/stats");
        setStats(res.data.data);
      } catch (err) {
        console.error("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading dashboard...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Dashboard
      </h1>

      {/* ================= AGENT DASHBOARD ================= */}
      {user.role === "agent" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KpiCard
            title="My Tickets"
            value={stats.myTickets}
          />
          <KpiCard
            title="Overdue Tickets"
            value={stats.overdue}
            danger
          />
          <KpiCard
            title="Escalated Tickets"
            value={stats.escalated}
            warning
          />
        </div>
      )}

      {/* ================= ADMIN DASHBOARD ================= */}
      {user.role === "admin" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <KpiCard
              title="Unassigned Tickets"
              value={stats.unassigned}
              warning
            />
            <KpiCard
              title="SLA Risk Tickets"
              value={stats.slaRisk}
              danger
            />
            <KpiCard
              title="Total Active Tickets"
              value={stats.totalActive}
            />
          </div>

          {/* Workload per agent */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Agent Workload
            </h2>

            <div className="space-y-3">
              {stats.agentWorkload.map((agent) => (
                <div
                  key={agent.agentId}
                  className="flex justify-between items-center"
                >
                  <span className="text-gray-600">
                    {agent.username}
                  </span>
                  <span className="font-semibold text-gray-800">
                    {agent.count} tickets
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;

/* ================= KPI CARD ================= */

const KpiCard = ({ title, value, danger, warning }) => {
  let color = "text-gray-800";
  if (danger) color = "text-red-600";
  if (warning) color = "text-amber-600";

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-3xl font-bold mt-2 ${color}`}>
        {value}
      </p>
    </div>
  );
};
