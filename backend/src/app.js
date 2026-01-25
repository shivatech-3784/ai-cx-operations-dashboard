import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// routes
app.use("/AICX-Dashboard/api/v1/users", userRoutes);
app.use("/AICX-Dashboard/api/v1/tickets", ticketRoutes);

app.get("/", (req, res) => {
  res.send("AI CX Operations Dashboard is working");
});

// ❗ REGISTER ERROR MIDDLEWARE — MUST BE LAST
app.use(errorMiddleware);

export default app;
