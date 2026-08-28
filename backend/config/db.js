import mongoose from 'mongoose'

const connectDB= async(req,res)=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("connected to mongoDB")
    }
    catch (error){
        console.log("MongoDB Error:", error.message);
    }
}
export default connectDB