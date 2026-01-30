import AuditLog from "../models/auditLog.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";

export const getAuditLogs = asyncHandler(async (req, res) => {
  const { action, range } = req.query;

  let filter = {};

  // Filter by action type
  if (action) {
    filter.action = action;
  }

  // Filter by date range
  if (range) {
    const now = new Date();
    let fromDate;

    if (range === "24h") {
      fromDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    } else if (range === "7d") {
      fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (range === "30d") {
      fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    if (fromDate) {
      filter.createdAt = { $gte: fromDate };
    }
  }

  const logs = await AuditLog.find(filter)
    .populate("performedBy", "username role")
    .populate("ticketId", "title") // ✅ CORRECT
    .sort({ createdAt: -1 });

  return res.status(200).json(new apiResponse(200, logs, "Audit logs fetched"));
});
