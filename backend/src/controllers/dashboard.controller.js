import  Ticket  from "../models/ticket.model.js";
import  User  from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const user = req.user;
  const now = new Date();

  // ================= AGENT DASHBOARD =================
  if (user.role === "agent") {
    const myTickets = await Ticket.countDocuments({
      $or: [
        { assignedTo: user._id },
        { createdBy: user._id },
      ],
    });

    const overdue = await Ticket.countDocuments({
      $or: [
        { assignedTo: user._id },
        { createdBy: user._id },
      ],
      status: { $ne: "resolved" },
      slaDeadline: { $lt: now },
    });

    const escalated = await Ticket.countDocuments({
      $or: [
        { assignedTo: user._id },
        { createdBy: user._id },
      ],
      isEscalated: true,
    });

    return res.status(200).json(
      new apiResponse(200, {
        myTickets,
        overdue,
        escalated,
      }, "Agent dashboard stats fetched")
    );
  }

  // ================= ADMIN DASHBOARD =================

  // Unassigned tickets
  const unassigned = await Ticket.countDocuments({
    assignedTo: null,
    status: { $ne: "resolved" },
  });

  // SLA risk: tickets due in next 6 hours
  const sixHoursLater = new Date(now.getTime() + 6 * 60 * 60 * 1000);

  const slaRisk = await Ticket.countDocuments({
    status: { $ne: "resolved" },
    slaDeadline: { $gte: now, $lte: sixHoursLater },
  });

  // Total active tickets
  const totalActive = await Ticket.countDocuments({
    status: { $ne: "resolved" },
  });

  // Workload per agent
  const agents = await User.find({ role: "agent" }).select("_id username");

  const agentWorkload = await Promise.all(
    agents.map(async (agent) => {
      const count = await Ticket.countDocuments({
        assignedTo: agent._id,
        status: { $ne: "resolved" },
      });

      return {
        agentId: agent._id,
        username: agent.username,
        count,
      };
    })
  );

  return res.status(200).json(
    new apiResponse(200, {
      unassigned,
      slaRisk,
      totalActive,
      agentWorkload,
    }, "Admin dashboard stats fetched")
  );
});
