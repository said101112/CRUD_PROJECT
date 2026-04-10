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
    project.value = await api.getProject(route.params.id);
  } catch (err) {
    console.error(err);
    alert('Failed to load project details');
    router.push('/');
  } finally {
    loading.value = false;
  }
});

const handleSubmit = async (projectData) => {
  try {
    await api.updateProject(route.params.id, projectData);
    router.push('/');
  } catch (err) {
    console.error(err);
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
