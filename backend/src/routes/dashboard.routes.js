import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// GET /api/v1/dashboard/stats
router.get("/stats", verifyJWT, getDashboardStats);

export default router;
