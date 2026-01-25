import express from "express";
import {
  createTicket,
  getAllTickets,
  updateTicketStatus,
  assignTicket,
  getTicketsByStatus,
  getEscalatedTickets,
  overrideSeverity,
  getTicketAuditLogs,
} from "../controllers/ticket.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

/**
 * Agent/Admin → create ticket
 */
router.post(
  "/create",
  verifyJWT,
  authorizeRoles("agent", "admin"),
  createTicket
);

/**
 * Any logged-in user → view all tickets
 */
router.get(
  "/get",
  verifyJWT,
  getAllTickets
);

/**
 * Ops/Admin → update ticket status
 */
router.patch(
  "/:ticketId/status",
  verifyJWT,
  authorizeRoles("agent", "admin"),
  updateTicketStatus
);

/**
 * Admin → assign ticket to ops
 */
router.patch(
  "/:ticketId/assign",
  verifyJWT,
  authorizeRoles("admin"),
  assignTicket
);

/**
 * Any logged-in user → filter tickets
 */
router.get(
  "/filter",
  verifyJWT,
  getTicketsByStatus
);

router.get(
  "/escalated",
  verifyJWT,
  authorizeRoles("admin"),
  getEscalatedTickets
);

router.patch(
  "/:ticketId/override-severity",
  verifyJWT,
  authorizeRoles("admin"),
  overrideSeverity
);

router.get(
  "/:ticketId/audit-logs",
  verifyJWT,
  authorizeRoles("admin"),
  getTicketAuditLogs
);

export default router;

