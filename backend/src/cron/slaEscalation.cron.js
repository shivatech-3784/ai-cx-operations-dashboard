import cron from "node-cron";
import Ticket from "../models/ticket.model.js";
import AuditLog from "../models/auditLog.model.js";
import { createNotification } from "../utils/notification.utils.js";

export const startSlaEscalationJob = () => {
  // Runs every 5 minutes
  cron.schedule("*/5 * * * *", async () => {
    try {
      const now = new Date();

      const overdueTickets = await Ticket.find({
        slaDeadline: { $lt: now },
        status: { $ne: "resolved" },
        isEscalated: false,
      });

      for (const ticket of overdueTickets) {
        ticket.isEscalated = true;
        await ticket.save();

        await AuditLog.create({
          ticketId: ticket._id,
          action: "SLA_ESCALATED",
          oldValue: "within SLA",
          newValue: "breached SLA",
          performedBy: null, // system action
          reason: "SLA deadline breached",
        });

        // 🔔 Notify admin
        await createNotification({
          user: ticket.createdBy,
          ticketId: ticket._id,
          type: "SLA_ESCALATED",
          message: `Ticket "${ticket.title}" has breached SLA and was escalated.`,
        });
      }

      if (overdueTickets.length > 0) {
        console.log(
          `⏱️ SLA Escalation Job: ${overdueTickets.length} ticket(s) escalated`,
        );
      }
    } catch (error) {
      console.error("SLA Escalation cron failed:", error.message);
    }
  });
};
