import {Router} from 'express'
import { getStudentUser, loginUser, logout, registerUser, studentIdeas } from '../controllers/student.controller'
import { verifyJWT } from '../middlewares/auth.middleware'

const router = Router()

router.route("/register-student").post(registerUser) 

router.route("/login").post(loginUser)

router.route("/getStudentUser").post(verifyJWT,getStudentUser)

router.route("/logout").post(verifyJWT,logout)

router.route("/getUserIdea/:email").get(verifyJWT,studentIdeas)

export default router