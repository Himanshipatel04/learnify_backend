import {Router} from 'express'
import {createIdea} from '../controllers/idea.controller'

const router = Router()

router.route("/create-idea").post(createIdea)


export default router