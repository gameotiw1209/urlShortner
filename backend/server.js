import express from 'express'
import connectDB from './config/db.js'
import urlRouter from './route/url.route.js'
const app=express()
app.use(express.json())

connectDB();

app.use('/api',urlRouter)

app.listen(5000,()=>{
    console.log("server running on port 5000")
})