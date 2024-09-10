import {Router} from 'express';
import { getAllUsers } from '../controllers/admin.controller';

const router = Router()

router.route("/allusers").get(getAllUsers)


export default router