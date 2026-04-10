const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// In local dev without security, no validation middlewares are used yet.
router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);
router.post('/', projectController.createProject);
router.put('/:id', projectController.updateProject);
router.patch('/:id/status', projectController.updateProjectStatus);
router.delete('/:id', projectController.deleteProject);

module.exports = router;
