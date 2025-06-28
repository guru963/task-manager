import mongoose from "mongoose";

const project=new mongoose.Schema({
    pname:{
        type:String,
        required:true
    },
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  workspaceId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Workspace",
    required:true
  }
})

export default mongoose.model("Project",project)