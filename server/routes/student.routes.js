import {Router} from 'express'
import { getStudentUser, loginUser, logout, registerUser } from '../controllers/student.controller'
import { verifyJWT } from '../middlewares/auth.middleware'

const router = Router()

router.route("/register-student").post(registerUser) 

router.route("/login").post(loginUser)

router.route("/getStudentUser").post(verifyJWT,getStudentUser)

router.route("/logout").post(verifyJWT,logout)

export default router