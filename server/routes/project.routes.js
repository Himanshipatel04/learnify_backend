import { Router } from "express";
const router = Router();
import { upload } from '../config/multer.config'; 
import createProject, { fetchProject }  from "../controllers/project.controller";


router.post('/create-project',upload.single('image'), createProject);
router.get('/getAllProjects').get(fetchProject);

export default router;
