import mongoose from "mongoose";
import shortid from "shortid";

const urlschema= new mongoose.Schema({
    shortId:{
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
export default mongoose.model('urls',urlschema)