const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const {
  createProject,
  getUserProjects,
  getProjectById,
  deleteProject,
  updateProjectStatus,
} = require('../controllers/project.controller');

const {
  getDomainByProjectId,
} = require('../controllers/domian.controller');

const router = express.Router();

router.use(verifyToken);

router.post('/projects', createProject);
router.get('/projects', getUserProjects);
router.get('/projects/:id', getProjectById);
router.delete('/projects/:id', deleteProject);
router.patch('/projects/:id/status', updateProjectStatus);

router.get('/projects/:id/domain', getDomainByProjectId);

module.exports = router;
