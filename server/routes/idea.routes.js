import {Router} from 'express'
import {createIdea} from '../controllers/idea.controller'
import { verifyJWT } from '../middlewares/auth.middleware'

const router = Router()

router.route("/create-idea").post(verifyJWT,createIdea)


export default router