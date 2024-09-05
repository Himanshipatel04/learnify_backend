import express from 'express'
require('dotenv').config();
import cors from "cors"
import dbConnection from './db/dbConnection'

//App and database connection
dbConnection();
const app = express()
app.get('/',(req,res)=>{
    res.send("Hello")
})



//Middlewares
app.use(cors())
app.use(express.json())



//Routes
import ideaRoutes from './routes/idea.routes'
import studentRoutes from './routes/student.routes'
app.use("/api/ideas",ideaRoutes)
app.use("/api/student",studentRoutes)




//server
app.listen(`${process.env.PORT}`,()=>{
    console.log(`App is running at ${process.env.PORT}`);
})