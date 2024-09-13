import { Router } from "express";
const router = Router();
import createProject, { fetchProject, fetchProjectById, groupDomain, groupProject }  from "../controllers/project.controller";


router.route('/getAllProjects').get(fetchProject);
router.route('/groupProjects').get(groupProject);
router.route('/getProjectById/:id').get(fetchProjectById);
router.route('/groupDomainProjects').get(groupDomain)

export default router;
