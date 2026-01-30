import "dotenv/config";
import http from "http";

import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import { initSocket } from "./src/socket/index.js";
import { startSlaEscalationJob } from "./src/cron/slaEscalation.cron.js";

connectDB()
  .then(() => {
    const server = http.createServer(app);

    // 🔌 Start WebSocket
    initSocket(server);

    // ⏱️ START CRON JOB (VERY IMPORTANT)
    startSlaEscalationJob();

    server.listen(process.env.PORT || 5000, () => {
      console.log("Server running on", process.env.PORT || 5000);
    });
  })
  .catch((err) => {
    console.error("Mongo connection failed", err);
  });
