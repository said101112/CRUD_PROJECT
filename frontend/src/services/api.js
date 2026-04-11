import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  // Get all projects
  getProjects() {
    return api.get('/projects').then(res => res.data);
  },
  
  // Get single project
  getProject(id) {
    return api.get(`/projects/${id}`).then(res => res.data);
  },
  
  // Create project
  createProject(projectData) {
    return api.post('/projects', projectData).then(res => res.data);
  },
  
  // Update project
  updateProject(id, projectData) {
    return api.put(`/projects/${id}`, projectData).then(res => res.data);
  },
  
  // Change status
  updateStatus(id, status) {
    return api.patch(`/projects/${id}/status`, { status }).then(res => res.data);
  },
  
  // Delete project
  deleteProject(id) {
    return api.delete(`/projects/${id}`);
  }
};
