<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Save, X } from 'lucide-vue-next';
import { z } from 'zod';
import DOMPurify from 'dompurify';

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

const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().min(1, "Description is required"),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  category: z.string().optional().nullable(),
  technologies: z.string().optional().nullable(),
  created_by: z.string().min(1, "Creator name is required").max(50),
  start_date: z.string().optional().or(z.literal('')),
  end_date: z.string().optional().or(z.literal('')),
  budget: z.number().min(0, "Budget must be positive").optional().nullable(),
  progress: z.number().min(0).max(100).optional().nullable(),
});

const errors = ref({});

const handleSubmit = () => {
  try {
    // 1. Validate with Zod
    projectSchema.parse(form.value);
    errors.value = {};
    
    // 2. Sanitize text inputs against XSS
    const sanitizedForm = {
      ...form.value,
      title: DOMPurify.sanitize(form.value.title),
      description: DOMPurify.sanitize(form.value.description),
      category: form.value.category ? DOMPurify.sanitize(form.value.category) : '',
      technologies: form.value.technologies ? DOMPurify.sanitize(form.value.technologies) : '',
      created_by: DOMPurify.sanitize(form.value.created_by),
    };

    // Replace empty strings with null for dates where DB expects true null
    if (!sanitizedForm.start_date) sanitizedForm.start_date = null;
    if (!sanitizedForm.end_date) sanitizedForm.end_date = null;

    emit('submit', sanitizedForm);
  } catch (err) {
    if (err instanceof z.ZodError) {
      const formattedErrors = {};
      err.errors.forEach(e => {
        if (e.path[0]) {
          formattedErrors[e.path[0]] = e.message;
        }
      });
      errors.value = formattedErrors;
    }
  }
};
</script>

<template>
  <div class="glass-panel form-container">
    <form @submit.prevent="handleSubmit" class="project-form">
      <div class="form-grid">
        <!-- Title -->
        <div class="form-group full-width">
          <label for="title">Project Title *</label>
          <input type="text" id="title" v-model="form.title" :class="{'error-input': errors.title}" placeholder="e.g. Build Payment Gateway">
          <span class="error-text" v-if="errors.title">{{ errors.title }}</span>
        </div>

        <!-- Description -->
        <div class="form-group full-width">
          <label for="description">Description *</label>
          <textarea id="description" v-model="form.description" rows="4" :class="{'error-input': errors.description}" placeholder="Project details..."></textarea>
          <span class="error-text" v-if="errors.description">{{ errors.description }}</span>
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
          <span class="error-text" v-if="errors.priority">{{ errors.priority }}</span>
        </div>
        
        <div class="form-group">
          <label for="category">Category</label>
          <input type="text" id="category" v-model="form.category" placeholder="e.g. Web, Mobile">
        </div>

        <!-- Created By -->
        <div class="form-group full-width">
          <label for="created_by">Created By *</label>
          <input type="text" id="created_by" v-model="form.created_by" :class="{'error-input': errors.created_by}" placeholder="Your name">
          <span class="error-text" v-if="errors.created_by">{{ errors.created_by }}</span>
        </div>

        <!-- Tech Stack -->
        <div class="form-group full-width">
          <label for="technologies">Technologies</label>
          <input type="text" id="technologies" v-model="form.technologies" placeholder="Vue, Node.js, PostgreSQL...">
        </div>

        <!-- Dates -->
        <div class="form-group">
          <label for="start_date">Start Date</label>
          <input type="date" id="start_date" v-model="form.start_date" :class="{'error-input': errors.start_date}">
          <span class="error-text" v-if="errors.start_date">{{ errors.start_date }}</span>
        </div>
        
        <div class="form-group">
          <label for="end_date">End Date</label>
          <input type="date" id="end_date" v-model="form.end_date" :class="{'error-input': errors.end_date}">
          <span class="error-text" v-if="errors.end_date">{{ errors.end_date }}</span>
        </div>
        
        <!-- Budget & Progress -->
        <div class="form-group">
          <label for="budget">Budget (€)</label>
          <input type="number" id="budget" v-model.number="form.budget" step="100" min="0" :class="{'error-input': errors.budget}">
          <span class="error-text" v-if="errors.budget">{{ errors.budget }}</span>
        </div>

        <div class="form-group" v-if="isEditing">
          <label for="progress">Progress (%)</label>
          <input type="number" id="progress" v-model.number="form.progress" min="0" max="100" :class="{'error-input': errors.progress}">
          <span class="error-text" v-if="errors.progress">{{ errors.progress }}</span>
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

.error-text {
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.error-input {
  border-color: #ef4444 !important;
}
</style>
