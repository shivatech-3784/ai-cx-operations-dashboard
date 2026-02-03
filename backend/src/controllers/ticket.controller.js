import Ticket from "../models/ticket.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { detectSeverity } from "../utils/severity.utils.js";
import { generateAiSummary } from "../utils/summary.utils.js";
import { analyzeTicketWithAI } from "../utils/ai.utils.js";
import AuditLog from "../models/auditLog.model.js";
import { createNotification } from "../utils/notification.utils.js";
import { getIO } from "../socket/index.js";
import User from "../models/user.model.js";

const calculateSlaDeadline = (severity) => {
  const now = new Date();

  const slaHours = {
    low: 72,
    medium: 48,
    high: 24,
  };

  now.setHours(now.getHours() + slaHours[severity]);
  return now;
};

export const createTicket = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    throw new apiError(400, "Title and description are required");
  }

  let severity = "low";
  let aiSummary = "AI summary unavailable";

  try {
    const aiResult = await analyzeTicketWithAI(title, description);
    severity = aiResult.severity;
    aiSummary = aiResult.summary;
  } catch (err) {
    console.error("Groq AI failed, using fallback");
  }

  const slaDeadline = calculateSlaDeadline(severity);

  const ticket = await Ticket.create({
    title,
    description,
    severity,
    aiSummary,
    slaDeadline,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new apiResponse(201, ticket, "Ticket created successfully"));
});

export const getAllTickets = asyncHandler(async (req, res) => {
  const user = req.user;
  let filter = {};

  // 🔒 Agent: only assigned or created tickets
  if (user.role === "agent") {
    filter = {
      assignedTo: user._id,
      status: { $ne: "resolved" },
    };
  }

  // 👑 Admin: sees all tickets (filter stays empty)
  const tickets = await Ticket.find(filter)
    .populate("createdBy", "username email")
    .populate("assignedTo", "username email")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new apiResponse(200, tickets, "Tickets fetched successfully"));
});

export const updateTicketStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const ticket = await Ticket.findById(req.params.ticketId);
  if (!ticket) {
    throw new apiError(404, "Ticket not found");
  }

  const now = new Date();

  if (ticket.slaDeadline && now > ticket.slaDeadline && status !== "resolved") {
    ticket.isEscalated = true;
  }

  ticket.status = status;
  await ticket.save();

  return res.json(new apiResponse(200, ticket, "Ticket status updated"));
});

export const assignTicket = asyncHandler(async (req, res) => {
  const { ticketId } = req.params;
  const { assignedTo } = req.body;

  if (!assignedTo) {
    throw new apiError(400, "assignedTo userId is required");
  }

  // 1️⃣ ASSIGNMENT (CRITICAL PATH)
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new apiError(404, "Ticket not found");
  }

  const previousAssigneeId = ticket.assignedTo;
  ticket.assignedTo = assignedTo;
  await ticket.save(); // ✅ NEVER BLOCK THIS

  // 2️⃣ AUDIT LOG (NON-CRITICAL, SAFE)
  try {
    const oldName = previousAssigneeId
      ? (await User.findById(previousAssigneeId)?.select("username"))?.username
      : "unassigned";

    const newName =
      (await User.findById(assignedTo)?.select("username"))?.username ||
      "unknown";

    await AuditLog.create({
      ticketId: ticket._id,
      action: "TICKET_ASSIGNED",
      oldValue: oldName,
      newValue: newName,
      performedBy: req.user._id,
    });
  } catch (err) {
    console.error("Audit log failed (ignored):", err.message);
  }

  // 3️⃣ RETURN UPDATED TICKET
  const populatedTicket = await Ticket.findById(ticket._id)
    .populate("createdBy", "username email")
    .populate("assignedTo", "username email");

  return res
    .status(200)
    .json(
      new apiResponse(200, populatedTicket, "Ticket assigned successfully"),
    );
});

export const getTicketsByStatus = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const allowedStatus = ["open", "in-progress", "resolved"];

  if (!allowedStatus.includes(status)) {
    throw new apiError(400, "Invalid status filter");
  }

  const tickets = await Ticket.find({ status })
    .populate("createdBy", "username")
    .populate("assignedTo", "username");

  return res
    .status(200)
    .json(new apiResponse(200, tickets, "Tickets fetched successfully"));
});

export const getEscalatedTickets = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find({ isEscalated: true });

  return res.json(new apiResponse(200, tickets, "Escalated tickets fetched"));
});

export const overrideSeverity = asyncHandler(async (req, res) => {
  const { ticketId } = req.params;
  const { severity } = req.body;

  if (!["low", "medium", "high"].includes(severity)) {
    throw new apiError(400, "Invalid severity value");
  }

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new apiError(404, "Ticket not found");
  }

  if (ticket.severity === severity) {
    throw new apiError(400, "Severity is already set to this value");
  }

  const oldSeverity = ticket.severity;

  ticket.severity = severity;
  ticket.slaDeadline = calculateSlaDeadline(severity);
  await ticket.save();

  await AuditLog.create({
    ticketId: ticket._id,
    action: "SEVERITY_OVERRIDE",
    oldValue: oldSeverity,
    newValue: severity,
    performedBy: req.user._id,
  });

  // 🔔 Notification
  await createNotification({
    user: ticket.createdBy,
    ticketId: ticket._id,
    type: "SEVERITY_OVERRIDDEN",
    message: `Severity for ticket "${ticket.title}" was changed to ${severity}.`,
  });

  return res.json(
    new apiResponse(200, ticket, "Severity overridden successfully"),
  );
});

export const overrideSla = asyncHandler(async (req, res) => {
  const { ticketId } = req.params;
  const { slaDeadline, reason } = req.body;

  if (!slaDeadline) {
    throw new apiError(400, "slaDeadline is required");
  }

  const newDeadline = new Date(slaDeadline);
  if (isNaN(newDeadline.getTime())) {
    throw new apiError(400, "Invalid slaDeadline format");
  }

  if (newDeadline < new Date()) {
    throw new apiError(400, "SLA must be in the future");
  }

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new apiError(404, "Ticket not found");
  }

  if (ticket.status === "resolved") {
    throw new apiError(400, "Cannot override SLA for resolved ticket");
  }

  const oldDeadline = ticket.slaDeadline?.toISOString() || "none";

  if (
    ticket.slaDeadline &&
    ticket.slaDeadline.getTime() === newDeadline.getTime()
  ) {
    throw new apiError(400, "SLA deadline is already set to this value");
  }

  ticket.slaDeadline = newDeadline;
  ticket.isEscalated = false;
  await ticket.save();

  await AuditLog.create({
    ticketId: ticket._id,
    action: "SLA_OVERRIDE",
    oldValue: oldDeadline,
    newValue: newDeadline.toISOString(),
    performedBy: req.user._id,
    reason: reason || "Manual SLA override by admin",
  });

  // 🔔 Notification
  await createNotification({
    user: ticket.createdBy,
    ticketId: ticket._id,
    type: "SLA_OVERRIDDEN",
    message: `SLA deadline for ticket "${ticket.title}" was updated.`,
  });

  return res.json(new apiResponse(200, ticket, "SLA overridden successfully"));
});
