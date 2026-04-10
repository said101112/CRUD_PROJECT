<script setup>
import { useRouter } from 'vue-router';
import api from '../services/api';
import ProjectForm from '../components/ProjectForm.vue';

const router = useRouter();

const handleSubmit = async (projectData) => {
  try {
    await api.createProject(projectData);
    router.push('/');
  } catch (err) {
    console.error(err);
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
