import { useEffect, useState } from "react";

import TicketCard from "../components/TicketCard";
import CreateTicketModal from "../components/CreateTicketModal";
import { fetchTickets } from "../services/ticket.api";

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTickets()
      .then(setTickets)
      .catch(() => console.error("Failed to fetch tickets"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Tickets
          </h2>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            + Create Ticket
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-gray-500">Loading tickets...</p>
        )}

        {/* Empty */}
        {!loading && tickets.length === 0 && (
          <p className="text-gray-500">No tickets found.</p>
        )}

        {/* =====================
            TICKET LIST (GAP HERE)
           ===================== */}
        <div className="space-y-6">
          {tickets.map((ticket) => (
            <TicketCard key={ticket._id} ticket={ticket} />
          ))}
        </div>
      </div>

      {/* Create Ticket Modal */}
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
