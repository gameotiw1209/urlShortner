import express from "express"
import urlModel from "../model/url.model.js";
import shortid from "shortid"

const urlRouter=express.Router();

urlRouter.post('/shortner',async(req,res)=>{
    const body =req.body
    if (!body.redirectURL){
        return res.json({
            msg:"enter url"
        })
    }
})
export default urlRouter