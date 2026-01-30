import { Server } from "socket.io";
import jwt from "jsonwebtoken";

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    },
  });

  // 🔐 SOCKET AUTH MIDDLEWARE (ADD HERE)
  io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("No access token"));
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
});

  // 🔌 CONNECTION HANDLER (AFTER middleware)
  io.on("connection", (socket) => {
    console.log("🔌 Authenticated socket connected:", socket.user._id);

    // auto-join personal room
    socket.join(socket.user._id.toString());
    console.log(`👤 User ${socket.user._id} joined their room`);

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
