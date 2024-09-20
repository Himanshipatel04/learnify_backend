import {Router} from 'express'
import {createIdea, fetchIdea} from '../controllers/idea.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'

const router = Router()

router.route("/create-idea").post(verifyJWT,createIdea)
router.route('/getIdeas').get(fetchIdea) 


export default router