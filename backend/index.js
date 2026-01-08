import dotenv from "dotenv"
import { connectDB } from "./src/config/db.js"
import app from "./src/app.js"

dotenv.config({
    path : './.env'
})

connectDB().then(()=>{
    app.listen(process.env.PORT || 5000, ()=>{
          console.log(`data base connected on ${process.env.PORT}`)
    })
})
.catch((error)=>{
    console.log("mongo connection failed",error)
})
