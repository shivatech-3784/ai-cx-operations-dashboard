import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import axiosInstance from "../services/axios";
import KpiCard from "../components/KpiCard";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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

  if (loading) return <p className="text-gray-500">Loading dashboard...</p>;
  if (!stats) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* ================= AGENT DASHBOARD ================= */}
      {user.role === "agent" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KpiCard
            title="My Tickets"
            value={stats.myTickets}
            onClick={() => navigate("/app/tickets?view=my")}
          />
          <KpiCard
            title="SLA Risk Tickets"
            value={stats.slaRisk}
            warning
            onClick={() => navigate("/app/tickets?view=sla-risk")}
          />
          <KpiCard
            title="Escalated Tickets"
            value={stats.escalated}
            warning
            onClick={() => navigate("/app/tickets?view=escalated")}
          />
          <KpiCard
            title="Overdue Tickets"
            value={stats.overdue}
            danger
            onClick={() => navigate("/app/tickets?view=overdue")}
          />
        </div>
      )}

      {/* ================= ADMIN DASHBOARD ================= */}
      {user.role === "admin" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KpiCard
            title="Unassigned Tickets"
            value={stats.unassigned}
            warning
            onClick={() => navigate("/app/tickets?view=unassigned")}
          />
          <KpiCard
            title="SLA Risk Tickets"
            value={stats.slaRisk}
            danger
            onClick={() => navigate("/app/tickets?view=sla-risk")}
          />
          <KpiCard
            title="Total Active Tickets"
            value={stats.totalActive}
            onClick={() => navigate("/app/tickets")}
          />
          <KpiCard
            title="Overdue Tickets"
            value={stats.overdue}
            danger
            onClick={() => navigate("/app/tickets?view=overdue")}
          />
        </div>
      )}

      {/* ================= AGENT WORKLOAD ================= */}
      {user.role === "admin" && stats.agentWorkload?.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Agent Workload
          </h2>

          <div className="bg-white rounded-xl shadow border divide-y">
            {stats.agentWorkload.map((agent) => (
              <div
                key={agent.agentId}
                className="flex justify-between items-center px-6 py-4 hover:bg-gray-50"
              >
                <span className="text-gray-700 font-medium">
                  {agent.username}
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold
              ${
                agent.count === 0
                  ? "bg-green-100 text-green-700"
                  : agent.count < 5
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
              }`}
                >
                  {agent.count} tickets
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
