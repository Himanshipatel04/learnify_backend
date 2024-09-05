import {Router} from 'express'
import { registerUser } from '../controllers/student.controller'

const router = Router()

router.route("/register-student").post(registerUser)


export default router