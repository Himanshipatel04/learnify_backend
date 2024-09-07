import {Router} from 'express'
import { getStudentUser, loginUser, registerUser } from '../controllers/student.controller'
import { verifyJWT } from '../middlewares/auth.middleware'

const router = Router()

router.route("/register-student").post(registerUser) 

router.route("/login-student").post(loginUser)

router.route("/getStudentUser").post(verifyJWT,getStudentUser)

export default router