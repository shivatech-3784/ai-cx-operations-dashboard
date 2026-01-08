import express from "express";
import {
  createUser,
  Loginuser,
  Logoutuser,
  getuserdetails,
  getuserbyid,
  getallusers,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// auth
router.post("/register", createUser);
router.post("/login", Loginuser);
router.post("/logout", verifyJWT, Logoutuser);

// user
router.get("/me", verifyJWT, getuserdetails);
router.get("/:id", verifyJWT, getuserbyid);
router.get("/", verifyJWT, getallusers);

export default router;
