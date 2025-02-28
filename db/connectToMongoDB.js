import mongoose from "mongoose";

const connectToMongoDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL,)
        console.log("connected to mongodb!")
    } catch (error) {
        console.log("Error connecting to mongoDV", error)
    }
}

export default connectToMongoDB