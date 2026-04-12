<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../services/api';
import ProjectForm from '../components/ProjectForm.vue';

const route = useRoute();
const router = useRouter();
const project = ref(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const projectData = await api.getProject(route.params.id);
    project.value = projectData || {
      id: route.params.id,
      name: '',
      description: '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  } catch (err) {
    console.error('Error loading project:', err);
    project.value = {
      id: route.params.id,
      name: '',
      description: '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  } finally {
    loading.value = false;
  }
});

const handleSubmit = async (projectData) => {
  try {
    const updated = await api.updateProject(route.params.id, projectData);
    if (updated && updated.id) {
      router.push('/');
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (err) {
    console.error('Error updating project:', err);
    alert('Failed to update project');
  }
};

const handleCancel = () => {
  router.push('/');
};
</script>

<template>
  <div class="view-container">
    <h2>Edit Project</h2>
    <div v-if="loading" class="loading">Loading...</div>
    <ProjectForm 
      v-else 
      :initial-data="project" 
      :is-editing="true"
      @submit="handleSubmit" 
      @cancel="handleCancel" 
    />
  </div>
</template>

<style scoped>
.view-container h2 {
  margin-bottom: 2rem;
  font-weight: 600;
  text-align: center;
}
.loading {
  text-align: center;
  color: var(--text-secondary);
  padding: 3rem;
}
</style>
