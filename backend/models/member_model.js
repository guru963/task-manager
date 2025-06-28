import mongoose from "mongoose"

const member=new mongoose.Schema({
    workspaceid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Workspace",
        required:true
    },
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    guest:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }

})

export default mongoose.model("Member",member)