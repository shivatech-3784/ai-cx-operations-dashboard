import Ticket from "../models/ticket.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { detectSeverity } from "../utils/severity.utils.js";
import { generateAiSummary } from "../utils/summary.utils.js";
import { analyzeTicketWithAI } from "../utils/ai.utils.js";

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

  return res.status(201).json(
    new apiResponse(201, ticket, "Ticket created successfully")
  );
});

export const getAllTickets = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find()
    .populate("createdBy", "username email")
    .populate("assignedTo", "username email");

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

  if (
    ticket.slaDeadline &&
    now > ticket.slaDeadline &&
    status !== "resolved"
  ) {
    ticket.isEscalated = true;
  }

  ticket.status = status;
  await ticket.save();

  return res.json(
    new apiResponse(200, ticket, "Ticket status updated")
  );
});


export const assignTicket = asyncHandler(async (req, res) => {
  const { ticketId } = req.params;
  const { assignedTo } = req.body;

  if (!assignedTo) {
    throw new apiError(400, "assignedTo userId is required");
  }

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new apiError(404, "Ticket not found");
  }

  ticket.assignedTo = assignedTo;
  await ticket.save();

  return res
    .status(200)
    .json(new apiResponse(200, ticket, "Ticket assigned successfully"));
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

  return res.json(
    new apiResponse(200, tickets, "Escalated tickets fetched")
  );
});

