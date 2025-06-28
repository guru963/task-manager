import express from "express"
import { getWorkspaceDetails, joinUserintoWorkspace, registerWorkspace,updateWorkspace,deleteWorkspace } from "../controllers/workspace_controller.js"
import { printworkspaces } from "../controllers/workspace_controller.js"
import authenticateUser from "../middleware/auth_middleware.js"
const workrouter=express.Router()
import upload from "../middleware/upload.js";



workrouter.post("/workspace-register",authenticateUser,registerWorkspace)
workrouter.get("/workspaces",authenticateUser,printworkspaces)
workrouter.get("/workspaces/:id",getWorkspaceDetails)
workrouter.post("/workspaces/:id/join",authenticateUser,joinUserintoWorkspace)
workrouter.put("/workspaces/update/:id",  upload.single('picture'), updateWorkspace);
workrouter.delete("/workspaces/delete/:id", authenticateUser, deleteWorkspace);

export default workrouter