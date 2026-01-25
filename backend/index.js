import "dotenv/config"; // 🔥 MUST be first, no function call

import { connectDB } from "./src/config/db.js";
import app from "./src/app.js";

import { startSlaEscalationJob } from "./src/cron/slaEscalation.cron.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on ${process.env.PORT || 5000}`);
    });
    // 🔥 Start background SLA job
    startSlaEscalationJob();
  })
  .catch((error) => {
    console.log("Mongo connection failed", error);
  });
