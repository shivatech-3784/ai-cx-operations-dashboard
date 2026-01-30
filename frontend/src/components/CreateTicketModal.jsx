import { useState } from "react";
import { createTicket } from "../services/ticket.api";

const CreateTicketModal = ({ onClose, onCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    console.log("🔥 CREATE CLICKED");

    if (!title || !description) {
      alert("Fill all fields");
      return;
    }

    try {
      setLoading(true);
      const ticket = await createTicket({ title, description });
      console.log("✅ CREATED:", ticket);
      onCreated(ticket);
      onClose();
    } catch (err) {
      console.error("❌ CREATE FAILED", err);
      alert("Create failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div style={{ background: "white", padding: 20, width: 400 }}>
        <h2>Create Ticket</h2>

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
        />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleCreate} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTicketModal;
