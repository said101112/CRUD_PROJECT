<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import StatusBadge from './StatusBadge.vue';
import PriorityBadge from './PriorityBadge.vue';
import { Edit2, Trash2, Calendar, Clock, Code } from 'lucide-vue-next';

const props = defineProps({
  project: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['delete', 'status-change']);
const router = useRouter();

const formatDate = (dateString) => {
  if (!dateString) return 'Not set';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const handleEdit = () => {
  router.push(`/projects/${props.project.id}/edit`);
};

const cycleStatus = () => {
  const current = props.project.status;
  let next = 'TODO';
  if (current === 'TODO') next = 'IN_PROGRESS';
  else if (current === 'IN_PROGRESS') next = 'DONE';
  else next = 'TODO'; // Or keep it DONE if strict
  
  emit('status-change', props.project.id, next);
};
</script>

<template>
  <div class="glass-panel project-card">
    <div class="card-header">
      <div class="badges">
        <StatusBadge :status="project.status" @click.stop="cycleStatus" class="clickable" title="Click to change status"/>
        <PriorityBadge :priority="project.priority || 'MEDIUM'" />
      </div>
      <div class="actions">
        <button class="icon-btn edit" @click.stop="handleEdit">
          <Edit2 :size="16" />
        </button>
        <button class="icon-btn delete" @click.stop="emit('delete', project.id)">
          <Trash2 :size="16" />
        </button>
      </div>
    </div>
    
    <div class="card-body">
      <h3>{{ project.title }}</h3>
      <p class="description">{{ project.description }}</p>
      
      <div class="meta-grid">
        <div class="meta-item" v-if="project.category">
          <span class="meta-label">Category</span>
          <span class="meta-value">{{ project.category }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Created By</span>
          <span class="meta-value">{{ project.created_by }}</span>
        </div>
      </div>
    </div>
    
    <div class="card-footer">
      <div class="footer-item">
        <Calendar :size="14" />
        <span>{{ formatDate(project.end_date) }}</span>
      </div>
      
      <!-- Progress Bar -->
      <div class="progress-container" :title="`${project.progress || 0}% Complete`">
        <div class="progress-bar" :style="{ width: `${project.progress || 0}%` }"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.project-card {
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  overflow: hidden;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  border-color: rgba(255, 255, 255, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.badges {
  display: flex;
  align-items: center;
  gap: 12px;
}

.clickable {
  cursor: pointer;
  transition: transform 0.1s;
}
.clickable:hover {
  transform: scale(1.05);
}

.actions {
  display: flex;
  gap: 4px;
}

.icon-btn {
  background: transparent;
  color: var(--text-secondary);
  padding: 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn.edit:hover { background: rgba(59, 130, 246, 0.1); color: var(--primary); }
.icon-btn.delete:hover { background: rgba(239, 68, 68, 0.1); color: var(--danger); }

.card-body h3 {
  font-size: 1.15rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.description {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.meta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  font-size: 0.8rem;
}

.meta-label {
  display: block;
  color: var(--text-secondary);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
}

.card-footer {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--border-color);
  padding-top: 1rem;
}

.footer-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.progress-container {
  width: 100px;
  height: 6px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), var(--info));
  border-radius: 10px;
  transition: width 0.3s ease;
}
</style>
