import express from "express"
import urlModel from "../model/url.model.js";
import shortid from "shortid"

const urlRouter = express.Router();

//this is bascially just to create ashortid by the url it gave 
urlRouter.post('/shortner', async (req, res) => {
   try {
    const body = req.body;
    if (!body.redirectURL) {
        return res.json({ msg: "enter url" });
    }
    const shorturlID = shortid();
    const url = await urlModel.create({
        shortId: shorturlID,
        redirectUrl: body.redirectURL,
    });
    return res.json({ id: shorturlID });
}
catch (err) {
        console.error("POST /shortner error:", err);
        return res.status(500).json({ error: err.message });
    }
});
// looks up the original URL using the shortID from the params
// logs this visit in visitHistory, then redirects the user to the real URL
urlRouter.get('/:shorturlID', async (req, res) => {
    try {
        const shorturlID = req.params.shorturlID
        const url = await urlModel.findOneAndUpdate(
            { shortId: shorturlID },
            { $push: { visitHistory: { timeStamps: new Date().toLocaleString("en-IN") } } }
        )
        if (!url) {
            return res.status(404).json({ msg: "Short URL not found" })
        }
        return res.redirect(url.redirectUrl)
    } catch (error) {
        console.error("GET /:shorturlID error:", error)
        return res.status(500).json({ msg: "error redirecting" })
    }
})
//this is for the anayltics purpose helping out for how many times a user clicked or gone through it at what time 
urlRouter.get('/analytics/:shorturlID', async (req, res) => {
try{
    const shorturlID = req.params.shorturlID;
    const result = await urlModel.findOne({
        shortId: shorturlID
    });
    if (!result) {
        return res.status(404).json({
            msg: "Short URL not found"
        });
    }
   
    return res.json({
        TotalClicks: result.visitHistory.length,
        Analytics: result.visitHistory
    });
}
catch(error){
    res.status(500).json({msg:'error while fetching history'})
}
});

export default urlRouter
