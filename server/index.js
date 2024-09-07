import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
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
app.use(cors({
    credentials:true
})) 
app.use(express.json())
app.use(cookieParser())
app.options('*', cors());
app.use(urlencoded({ extended: true }));
app.use(express.static("public"));



//Routes
import ideaRoutes from './routes/idea.routes'
import studentRoutes from './routes/student.routes'
app.use("/api/ideas",ideaRoutes)
app.use("/api/student",studentRoutes)




//server
app.listen(`${process.env.PORT}`,()=>{
    console.log(`App is running at ${process.env.PORT}`);
})