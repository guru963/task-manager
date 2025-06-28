import express from "express"
import { allTasks, createTask, deleteTask, printTasks, updateTask } from "../controllers/task_controllers.js"

const taskrouter=express.Router()

taskrouter.post("/:projectid/create-task",createTask)
taskrouter.get("/:projectid/all-tasks",printTasks)
taskrouter.get("/every-tasks",allTasks)
taskrouter.put("/:projectid/:taskid/update",updateTask)
taskrouter.patch("/:projectid/:taskid", updateTask);

taskrouter.delete("/:projectid/:taskid/delete",deleteTask)

export default taskrouter