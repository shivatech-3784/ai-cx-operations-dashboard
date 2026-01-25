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
router.route("/register").post(createUser);
router.route("/login").post(Loginuser);
router.route("/logout").post(verifyJWT, Logoutuser);

// user
router.route("/me").get(verifyJWT, getuserdetails);
router.route("/:id").get(verifyJWT, getuserbyid);
router.route("/").get(verifyJWT, getallusers);

export default router;
