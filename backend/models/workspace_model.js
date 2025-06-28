import mongoose from "mongoose";

const workspace=new mongoose.Schema({
    workspacename:{
        type:String,
        required:true
    },
    picture:{
        type:String,
        required:true
    },
    teammembers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }],
     userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
})

export default mongoose.model("Workspace",workspace)