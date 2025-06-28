import mongoose from "mongoose";

const connectdb=async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("DB connected succesfully")
    } catch (error) {
        console.log("Error in connecting DB")
    }
}

export default connectdb