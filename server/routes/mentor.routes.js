import { Router } from "express";
import { getMentors, getMentorUser, loginMentor, logout, registerMentor } from "../controllers/mentor.controller";
import { verifyJWTM } from "../middlewares/authm.middleware";

const router = Router()

router.route("/register-mentor").post(registerMentor)
router.route("/login").post(loginMentor)
router.route("/getMentorUser").post(verifyJWTM,getMentorUser)
router.route("/logout").post(verifyJWTM,logout)
router.route("/getMentors").get(getMentors)

export default router