import { Router } from "express";
import { createMentorProject, getMentors, getMentorUser, getProjectById, getProjects, loginMentor, logout, registerMentor } from "../controllers/mentor.controller";
import { verifyJWTM } from "../middlewares/authm.middleware";
import { upload } from '../config/multer.config'; 

const router = Router()

router.post("/register-mentor",upload.single('image'), registerMentor);
router.route("/login").post(loginMentor)
router.route("/getMentorUser").post(verifyJWTM,getMentorUser)
router.route("/logout").post(verifyJWTM,logout)
router.route("/getMentors").get(getMentors)
router.route("/getProjectById/:id").get(getProjectById)
router.post("/create-project", upload.single('image') ,createMentorProject)
router.route("/projects").get(getProjects)

export default router

