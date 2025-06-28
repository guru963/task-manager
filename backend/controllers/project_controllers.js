import mongoose from "mongoose"
import Project from "../models/project_model.js"

const createProject = async (req, res) => {
  try {
    const { pname ,workspaceId} = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const newproject = new Project({
      pname,
      userId: req.user._id,
       workspaceId
    });

    await newproject.save();

    res.status(200).json({
      message: "Project created successfully"
    });
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({
      message: "Failed to create a project",
      error: error.message
    });
  }
};

const printProjects=async(req,res)=>{
   try {
    const {workspaceId}=req.query;
    const data = await Project.find({ workspaceId })
      .populate({
        path: 'workspaceId',
        populate: {
          path: 'teammembers', 
          model: 'User' 
        }
      });
    res.status(200).json({
        message:"Got projects successfully",
        data
    })
   } catch (error) {
     res.status(400).json({
        message:"Failed fetching Projects"
    })
    
   }
}

const getProject=async(req,res)=>{
    try {
        const {id}=req.params
    const data=await Project.findById(id)
    res.status(200).json({
        message:"Project Got Successfully",
        data
    })
    } catch (error) {
        res.status(400).json({
        message:"Error in fetching Project",
        error
    })
    }
}

export {createProject,printProjects,getProject}