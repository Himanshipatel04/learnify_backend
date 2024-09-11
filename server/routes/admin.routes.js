import {Router} from 'express';
import { deleteIdea, deleteMentor, deleteProject, deleteUsers, findValues, getAllUsers } from '../controllers/admin.controller';

const router = Router()

router.route("/allusers").get(getAllUsers)
router.route("/getValues").get(findValues)
router.route("/deleteUser/:id").delete(deleteUsers)
router.route("/deleteProject/:id").delete(deleteProject)
router.route("/deleteIdea/:id").delete(deleteIdea)
router.route("/deleteMentor/:id").delete(deleteMentor)


export default router