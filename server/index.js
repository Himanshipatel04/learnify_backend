import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import bodyParser from 'body-parser';
dotenv.config();
import cors from "cors";
import dbConnection from "./db/dbConnection.js";

//App and database connection
dbConnection();
const app = express();
app.get("/", (req, res) => {
  res.send("Hello");
});

//Middlewares
app.use(
  cors({
    origin: "https://learnifyprojectapp.netlify.app",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(bodyParser.json());

//Routes
import ideaRoutes from "./routes/idea.routes.js";
import studentRoutes from "./routes/student.routes.js";
import mentorRoutes from "./routes/mentor.routes.js";
import projectRoutes from "./routes/project.routes.js";
import adminRoutes from "./routes/admin.routes.js";
app.use("/api/ideas", ideaRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/admin", adminRoutes);

//server
app.listen(`${process.env.PORT}`, () => {
  console.log(`App is running at ${process.env.PORT}`);
});
