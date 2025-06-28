import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectdb from "./db/auth_db.js"
import router from "./routes/auth_routes.js"
import cookieParser from "cookie-parser"
import workrouter from "./routes/workspace_routes.js"
import projectroute from "./routes/project_routes.js"
import taskrouter from "./routes/task_routes.js"
dotenv.config()
const app=express()

connectdb()
app.use(express.json())
app.use(cors({
     origin: "http://localhost:5173", // your frontend origin (adjust if needed)
    credentials: true,
}))
app.use(cookieParser())
app.listen(3000,()=>{
    console.log("Succesfully working")
})
app.get("/",(req,res)=>{
    res.json({
        "message":"Succesfully installed"
    })
})

app.use("/auth",router)
app.use("/work",workrouter)
app.use("/project",projectroute)
app.use("/task",taskrouter)