<script setup>
import { useRouter } from 'vue-router';
import api from '../services/api';
import ProjectForm from '../components/ProjectForm.vue';

const router = useRouter();

const handleSubmit = async (projectData) => {
  try {
    const created = await api.createProject(projectData);
    if (created && created.id) {
      router.push('/');
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (err) {
    console.error('Error creating project:', err);
    alert('Failed to create project');
  }
};

const handleCancel = () => {
  router.push('/');
};
</script>

<template>
  <div class="view-container">
    <h2>Create New Project</h2>
    <ProjectForm @submit="handleSubmit" @cancel="handleCancel" />
  </div>
</template>

<style scoped>
.view-container h2 {
  margin-bottom: 2rem;
  font-weight: 600;
  text-align: center;
}
</style>
