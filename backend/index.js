import "dotenv/config"; // 🔥 MUST be first, no function call

import { connectDB } from "./src/config/db.js";
import app from "./src/app.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on ${process.env.PORT || 5000}`);
    });
  })
  .catch((error) => {
    console.log("Mongo connection failed", error);
  });
