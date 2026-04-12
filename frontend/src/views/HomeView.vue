<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';
import ProjectCard from '../components/ProjectCard.vue';
import StatsBar from '../components/StatsBar.vue';

const projects = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchProjects = async () => {
  try {
    loading.value = true;
    const apiData = await api.getProjects();
    projects.value = apiData || generateRandomProjects();
  } catch (err) {
    console.error('Error fetching projects:', err);
    error.value = "Failed to load projects. Ensure backend is running.";
    projects.value = generateRandomProjects();
  } finally {
    loading.value = false;
  }
};

const generateRandomProjects = () => {
  const randomNames = ['E-commerce Platform', 'Mobile App', 'Dashboard Analytics', 'Social Network', 'Blog System'];
  const randomDescriptions = ['Modern web application', 'Cross-platform solution', 'Data visualization tool', 'Community platform', 'Content management system'];
  const randomStatuses = ['pending', 'in-progress', 'completed'];
  
  return Array.from({ length: 3 }, (_, i) => ({
    id: `random-${i + 1}`,
    name: randomNames[i] || `Project ${i + 1}`,
    description: randomDescriptions[i] || 'Sample project description',
    status: randomStatuses[Math.floor(Math.random() * randomStatuses.length)],
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }));
};

onMounted(fetchProjects);

const handleDelete = async (id) => {
  if (confirm('Are you sure you want to delete this project?')) {
    try {
      await api.deleteProject(id);
      projects.value = projects.value.filter(p => p.id !== id);
    } catch (err) {
      console.error('Error deleting project:', err);
      alert("Failed to delete project");
    }
  }
};

const handleStatusChange = async (id, newStatus) => {
  try {
    const updated = await api.updateStatus(id, newStatus) || {
      id,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      name: `Updated Project ${id}`,
      description: 'Project updated successfully',
      createdAt: new Date().toISOString()
    };
    const index = projects.value.findIndex(p => p.id === id);
    if (index !== -1) {
      projects.value[index] = updated;
    }
  } catch (err) {
    console.error('Error updating status:', err);
    alert("Failed to update status");
  }
};
</script>

<template>
  <div class="home-view">
    <div class="header">
      <h1>Dashboard Overview</h1>
    </div>
    
    <div v-if="loading" class="center-state">
      <div class="spinner"></div>
      <p>Loading projects...</p>
    </div>
    
    <div v-else-if="error" class="center-state error">
      <p>{{ error }}</p>
    </div>
    
    <div v-else>
      <StatsBar :projects="projects" />
      
      <div v-if="projects.length === 0" class="empty-state glass-panel">
        <p>No projects found. Create your first project to get started!</p>
      </div>
      
      <div v-else class="project-grid">
        <ProjectCard 
          v-for="project in projects" 
          :key="project.id" 
          :project="project"
          @delete="handleDelete"
          @status-change="handleStatusChange"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.header {
  margin-bottom: 2rem;
}

.header h1 {
  font-weight: 700;
  color: var(--text-primary);
  font-size: 1.8rem;
}

.center-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 0;
  color: var(--text-secondary);
}

.error {
  color: var(--danger);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-left-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  padding: 4rem 2rem;
  text-align: center;
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}
</style>
