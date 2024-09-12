import { Router } from "express";
const router = Router();
import { upload } from '../config/multer.config'; 
import createProject, { fetchProject, fetchProjectById, groupDomain, groupProject }  from "../controllers/project.controller";


router.post('/create-project',upload.single('image'), createProject);
router.route('/getAllProjects').get(fetchProject);
router.route('/groupProjects').get(groupProject);
router.route('/getProjectById/:id').get(fetchProjectById);
router.route('/groupDomainProjects').get(groupDomain)

export default router;
