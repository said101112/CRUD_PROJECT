import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  // Get all projects
  async getProjects() {
    try {
      const response = await api.get('/projects');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      return [];
    }
  },
  
  // Get single project
  async getProject(id) {
    try {
      const response = await api.get(`/projects/${id}`);
      return response.data || {
        id: id,
        name: 'Unknown Project',
        description: '',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Failed to fetch project ${id}:`, error);
      return {
        id: id,
        name: 'Unknown Project',
        description: '',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  },
  
  // Create project
  async createProject(projectData) {
    try {
      const response = await api.post('/projects', projectData);
      return response.data || { ...projectData, id: Date.now().toString() };
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error;
    }
  },
  
  // Update project
  async updateProject(id, projectData) {
    try {
      const response = await api.put(`/projects/${id}`, projectData);
      return response.data || { ...projectData, id };
    } catch (error) {
      console.error(`Failed to update project ${id}:`, error);
      throw error;
    }
  },
  
  // Change status
  async updateStatus(id, status) {
    try {
      const response = await api.patch(`/projects/${id}/status`, { status });
      return response.data || { id, status, updatedAt: new Date().toISOString() };
    } catch (error) {
      console.error(`Failed to update status for project ${id}:`, error);
      throw error;
    }
  },
  
  // Delete project
  async deleteProject(id) {
    try {
      await api.delete(`/projects/${id}`);
      return true;
    } catch (error) {
      console.error(`Failed to delete project ${id}:`, error);
      throw error;
    }
  }
};
