import express from 'express';
import * as projectController from '../controllers/projectController.js';
import {
  validateProjectCreation,
  validateProjectUpdate,
  validateProjectStatus,
  validateProjectId
} from '../middlewares/validationMiddleware.js';

const router = express.Router();

router.get('/', projectController.getAllProjects);
router.get('/:id', validateProjectId, projectController.getProjectById);
router.post('/', validateProjectCreation, projectController.createProject);
router.put('/:id', validateProjectUpdate, projectController.updateProject);
router.patch('/:id/status', validateProjectStatus, projectController.updateProjectStatus);
router.delete('/:id', validateProjectId, projectController.deleteProject);

export default router;
