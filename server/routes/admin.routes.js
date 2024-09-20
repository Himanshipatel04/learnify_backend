import {Router} from 'express';
import { adminLogin, deleteIdea, deleteMentor, deleteProject, deleteProjectMentor, deleteUsers, findValues, getAllUsers } from '../controllers/admin.controller.js';
import { verifyAdmin } from '../middlewares/autha.middleware.js';

const router = Router()

router.route('/login').post(adminLogin);
router.route("/allusers").get(getAllUsers)
router.route("/getValues").get(findValues)
router.route("/deleteUser/:id").delete(deleteUsers)
router.route("/deleteProject/:id").delete(deleteProject)
router.route("/deleteIdea/:id").delete(deleteIdea)
router.route("/deleteMentor/:id").delete(deleteMentor)
router.route('/deleteProjectMentor/:id').delete(deleteProjectMentor)
router.post('/getAdmin', verifyAdmin, (req, res) => {
    const adminData = {
        email: req.admin.email,
    };
    res.status(200).json(adminData);
});
router.post('/logout', verifyAdmin, (req, res) => {
    return res.clearCookie('token').json({ message: 'Admin logged out successfully!' });
});


export default router