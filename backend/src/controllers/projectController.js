import ProjectModel from '../models/projectModel.js';

export const getAllProjects = async (req, res) => {
  try {
    const projects = await ProjectModel.findAll();
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error retrieving projects' });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await ProjectModel.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error retrieving project' });
  }
};

export const createProject = async (req, res) => {
  try {
    const project = await ProjectModel.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error creating project' });
  }
};

export const updateProject = async (req, res) => {
  try {
    const updatedProject = await ProjectModel.update(req.params.id, req.body);
    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(updatedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating project' });
  }
};

export const updateProjectStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updatedProject = await ProjectModel.updateStatus(req.params.id, status);
    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(updatedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating project status' });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const success = await ProjectModel.delete(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error deleting project' });
  }
};
