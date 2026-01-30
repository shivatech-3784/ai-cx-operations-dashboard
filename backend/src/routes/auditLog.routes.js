import { Router } from "express";
import { getAuditLogs } from "../controllers/auditlog.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

// Admin-only audit logs
router.get(
  "/",
  verifyJWT,
  authorizeRoles("admin"),
  getAuditLogs
);

export default router;
