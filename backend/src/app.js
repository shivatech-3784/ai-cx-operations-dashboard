import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("AI CX Operations dashboard is working");
})

export default app;
