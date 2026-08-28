import mongoose from "mongoose";

const urlschema= new mongoose.Schema({
    typeId:{
        type:String,
        required:true,
        unique:true
    },
    redirectUrl:{
        type:String,
        reuired:true
    },
    visitHistory:[{
        timeStamps:{type:String}
    }]
});
export default mongoose.model('user',urlschema)