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
    </div>
  );
};

export default Dashboard;
