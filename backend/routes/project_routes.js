import express from "express"
import { createProject, getProject, printProjects } from "../controllers/project_controllers.js"
import authenticateUser from "../middleware/auth_middleware.js"
const projectroute=express.Router()

projectroute.post("/create-project",authenticateUser,createProject)

projectroute.get("/all-projects",authenticateUser,printProjects)
projectroute.get("/:id",authenticateUser,getProject)



export default projectroute