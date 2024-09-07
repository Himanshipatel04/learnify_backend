import {Router} from 'express'
import { loginUser, registerUser } from '../controllers/student.controller'

const router = Router()

router.route("/register-student").post(registerUser)

router.route("/login-student").post(loginUser)


export default router