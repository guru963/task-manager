import Project from "../models/project_model.js";
import Task from "../models/task_model.js";


const createTask=async(req,res)=>{
    try {
        const {projectid}=req.params;
        const {tname,description,status,members,Datecomplete,priority}=req.body
        
        const isexist=await Project.findById(projectid)
        if(!isexist){
            return res.status(500).json({
                message:"Project Id is invalid"
            })
        }
        const pname=isexist.pname
        const newtask=new Task({
            tname,
            description,
            status,
            projectid,
            members,
            Datecomplete,
            priority
        })
        await newtask.save()
        res.status(200).json({
            message:"Task created Succesfully",
            pname
        })


    } catch (error) {
         res.status(400).json({
            message:"Failed to create a task",
            error
        })
    }
}

const printTasks=async(req,res)=>{
    try {
        const {projectid}=req.params
        const isexist=await Project.findById(projectid)
        if(!isexist){
            return res.status(400).json({
                message:"Project Id does not exist"
            })
        }
        const pname=isexist.pname
        const tasks=await Task.find({projectid}).populate("members","name")
        res.status(200).json({
            message:"Tasks obtained Succesfully",
            pname,
            tasks
        })
    } catch (error) {
        res.status(500).json({
            message:"Failed in obtaining the task",
            error
        })
    }
}


const allTasks = async (req, res) => {
    try {
        const { workspaceId } = req.query;
        if (!workspaceId) {
            return res.status(400).json({ message: "workspaceId is required" });
        }

        const projects = await Project.find({ workspaceId }).select("_id");
        const projectIds = projects.map(p => p._id);

        const tasks = await Task.find({
            projectid: { $in: projectIds }
        }).populate("projectid").populate("members");

        res.status(200).json({
            message: "Tasks obtained successfully",
            tasks
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to obtain tasks",
            error
        });
    }
};


const updateTask=async(req,res)=>{
    try {
        const {projectid,taskid}=req.params
        const updatedData=req.body

        const isexist=await Project.findById(projectid)
         if(!isexist){
            return res.status(400).json({
                message:"Project Id does not exist"
            })
        }
        

        const newtask=await Task.findOneAndUpdate(
            {_id:taskid,projectid
            },
            { $set:updatedData},
            {new:true}
        )
         if(!newtask){
            return res.status(400).json({
                message:"Task Id does not exist"
            })
        }

        res.status(200).json({
            message:"Updated Succesfully",
            task:newtask
        })

    } catch (error) {
        res.status(400).json({
            message:"Update Failure",
            error
        })
    }
}
const deleteTask=async(req,res)=>{
    try {
        const {projectid,taskid}=req.params
        const isexist=await Project.findById(projectid)
         if(!isexist){
            return res.status(400).json({
                message:"Project Id does not exist"
            })
        }

        const deletetask=await Task.findOneAndDelete({_id:taskid,projectid},{new:true})
        res.status(200).json({
            message:"Deleted Succesfully",
            task:deletetask
        })
        
    } catch (error) {
        res.status(400).json({
            message:"Delete Failure",
            error
        })
        
    }
}

export {createTask,printTasks,updateTask,deleteTask,allTasks}