<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Save, X } from 'lucide-vue-next';

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({})
  },
  isEditing: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['submit', 'cancel']);
const router = useRouter();

const form = ref({
  title: '',
  description: '',
  priority: 'MEDIUM',
  category: '',
  technologies: '',
  created_by: '',
  start_date: '',
  end_date: '',
  budget: null,
  progress: 0,
});

onMounted(() => {
  if (props.isEditing && props.initialData) {
    Object.keys(form.value).forEach(key => {
      if (props.initialData[key] !== undefined) {
        if ((key === 'start_date' || key === 'end_date') && props.initialData[key]) {
          form.value[key] = new Date(props.initialData[key]).toISOString().split('T')[0];
        } else {
          form.value[key] = props.initialData[key];
        }
      }
    });
  }
});

const handleSubmit = () => {
  emit('submit', { ...form.value });
};
</script>

<template>
  <div class="glass-panel form-container">
    <form @submit.prevent="handleSubmit" class="project-form">
      <div class="form-grid">
        <!-- Title -->
        <div class="form-group full-width">
          <label for="title">Project Title *</label>
          <input type="text" id="title" v-model="form.title" required placeholder="e.g. Build Payment Gateway">
        </div>

        <!-- Description -->
        <div class="form-group full-width">
          <label for="description">Description *</label>
          <textarea id="description" v-model="form.description" rows="4" required placeholder="Project details..."></textarea>
        </div>

        <!-- Priority & Category -->
        <div class="form-group">
          <label for="priority">Priority</label>
          <select id="priority" v-model="form.priority">
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="category">Category</label>
          <input type="text" id="category" v-model="form.category" placeholder="e.g. Web, Mobile">
        </div>

        <!-- Created By -->
        <div class="form-group full-width">
          <label for="created_by">Created By *</label>
          <input type="text" id="created_by" v-model="form.created_by" required placeholder="Your name">
        </div>

        <!-- Tech Stack -->
        <div class="form-group full-width">
          <label for="technologies">Technologies</label>
          <input type="text" id="technologies" v-model="form.technologies" placeholder="Vue, Node.js, PostgreSQL...">
        </div>

        <!-- Dates -->
        <div class="form-group">
          <label for="start_date">Start Date</label>
          <input type="date" id="start_date" v-model="form.start_date">
        </div>
        
        <div class="form-group">
          <label for="end_date">End Date</label>
          <input type="date" id="end_date" v-model="form.end_date">
        </div>
        
        <!-- Budget & Progress (only on edit mode helps simplify, but let's allow progress if editing) -->
        <div class="form-group">
          <label for="budget">Budget (€)</label>
          <input type="number" id="budget" v-model.number="form.budget" step="100" min="0">
        </div>

        <div class="form-group" v-if="isEditing">
          <label for="progress">Progress (%)</label>
          <input type="number" id="progress" v-model.number="form.progress" min="0" max="100">
        </div>
      </div>

      <div class="form-actions">
        <button type="button" class="btn btn-secondary" @click="emit('cancel')">
          <X :size="18" /> Cancel
        </button>
        <button type="submit" class="btn btn-primary">
          <Save :size="18" /> {{ isEditing ? 'Update Project' : 'Create Project' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-container {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.full-width {
  grid-column: 1 / -1;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}
</style>
