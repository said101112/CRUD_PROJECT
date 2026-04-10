import express from 'express';
import * as projectController from '../controllers/projectController.js';

const router = express.Router();

// In local dev without security, no validation middlewares are used yet.
router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);
router.post('/', projectController.createProject);
router.put('/:id', projectController.updateProject);
router.patch('/:id/status', projectController.updateProjectStatus);
router.delete('/:id', projectController.deleteProject);

export default router;
