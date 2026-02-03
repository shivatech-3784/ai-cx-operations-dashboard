import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/authContext";

import TicketCard from "../components/TicketCard";
import CreateTicketModal from "../components/CreateTicketModal";
import { fetchTickets } from "../services/ticket.api";

const Tickets = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const view = searchParams.get("view");

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const data = await fetchTickets();
        setTickets(data);
      } catch {
        console.error("Failed to fetch tickets");
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  const handleTicketUpdate = (updatedTicket) => {
    setTickets((prev) =>
      prev.map((t) =>
        t._id === updatedTicket._id ? updatedTicket : t
      )
    );
  };

  /* ================= FILTER LOGIC ================= */
  const now = new Date();
const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

const filteredTickets = tickets.filter((ticket) => {
  if (!ticket.slaDeadline) return false;

  const slaDate = new Date(ticket.slaDeadline);

  // 👤 Agent's own tickets
  if (view === "my") {
    return ticket.assignedTo?._id === user?._id;
  }

  // ⚠️ SLA RISK (about to breach)
  if (view === "sla-risk") {
    return (
      slaDate > now &&
      slaDate <= next24h &&
      ticket.status !== "resolved"
    );
  }

  // ⏰ OVERDUE (admin + agent)
  if (view === "overdue") {
    return slaDate < now && ticket.status !== "resolved";
  }

  // 🔥 Escalated (process-based)
  if (view === "escalated") {
    return ticket.isEscalated;
  }

  // 🧑‍💼 Admin unassigned
  if (view === "unassigned") {
    return !ticket.assignedTo;
  }

  return true; // default: all tickets
});


  return (
    <div className="min-h-screen bg-[#e5e2de]">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Tickets</h2>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            + Create Ticket
          </button>
        </div>

        {loading && <p className="text-gray-500">Loading tickets...</p>}

        {!loading && filteredTickets.length === 0 && (
          <p className="text-gray-500">No tickets found.</p>
        )}

        <div className="space-y-6">
          {filteredTickets.map((ticket) => (
            <TicketCard
              key={ticket._id}
              ticket={ticket}
              onTicketUpdate={handleTicketUpdate}
            />
          ))}
        </div>
      </div>

      {showModal && (
        <CreateTicketModal
          onClose={() => setShowModal(false)}
          onCreated={(newTicket) =>
            setTickets((prev) => [newTicket, ...prev])
          }
        />
      )}
    </div>
  );
};

export default Tickets;
