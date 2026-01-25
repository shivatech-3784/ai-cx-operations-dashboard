import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },

    action: {
      type: String,
      enum: ["SEVERITY_OVERRIDE", "SLA_OVERRIDE"],
      required: true,
    },

    oldValue: {
      type: String,
      required: true,
    },

    newValue: {
      type: String,
      required: true,
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("AuditLog", auditLogSchema);
