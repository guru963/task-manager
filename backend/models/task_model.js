import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  tname: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["Completed", "Inprogress", "OverDue", "Review", "NewTask"],
    default: "NewTask"
  },
  projectid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  }],
  priority:{
    type:String,
    enum:["Urgent","High","Medium","Low"],
    required:true
  },
  Datecomplete:{
    type:Date,
    required:true
  }
});

export default mongoose.model("Task", taskSchema);
