import {Router} from 'express'
import {createIdea, fetchIdea} from '../controllers/idea.controller'
import { verifyJWT } from '../middlewares/auth.middleware'

const router = Router()

router.route("/create-idea").post(verifyJWT,createIdea)
router.route('/getIdeas').get(fetchIdea) 


export default router