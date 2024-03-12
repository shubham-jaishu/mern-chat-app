import mongoose from "mongoose"
import dotenv from "dotenv";
dotenv.config()
console.log(process.env.MONGO_DB_URI)
const connectToMongoDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_DB_URI)
        console.log("Connected to MongoDB")
    }
    catch(err){
        console.log("Error connecting to MongoDB", err.message)
    }
}

export default connectToMongoDB