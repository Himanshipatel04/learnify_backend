import { Router } from "express";
const router = Router();
import { upload } from '../config/multer.config'; 
import createProject, { fetchProject, fetchProjectById }  from "../controllers/project.controller";


router.post('/create-project',upload.single('image'), createProject);
router.route('/getAllProjects').get(fetchProject);
router.route('/getProjectById/:id').get(fetchProjectById);

export default router;
