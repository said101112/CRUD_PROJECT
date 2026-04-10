<script setup>
import { computed } from 'vue';

const props = defineProps({
  projects: {
    type: Array,
    required: true
  }
});

const stats = computed(() => {
  const total = props.projects.length;
  const todo = props.projects.filter(p => p.status === 'TODO').length;
  const inProgress = props.projects.filter(p => p.status === 'IN_PROGRESS').length;
  const done = props.projects.filter(p => p.status === 'DONE').length;
  
  const completionRate = total ? Math.round((done / total) * 100) : 0;
  
  return { total, todo, inProgress, done, completionRate };
});
</script>

<template>
  <div class="stats-grid">
    <div class="stat-card glass-panel">
      <div class="stat-value">{{ stats.total }}</div>
      <div class="stat-label">Total Projects</div>
    </div>
    
    <div class="stat-card glass-panel todo">
      <div class="stat-value">{{ stats.todo }}</div>
      <div class="stat-label">To Do</div>
    </div>
    
    <div class="stat-card glass-panel progress">
      <div class="stat-value">{{ stats.inProgress }}</div>
      <div class="stat-label">In Progress</div>
    </div>
    
    <div class="stat-card glass-panel done">
      <div class="stat-value">{{ stats.done }}</div>
      <div class="stat-label">Completed</div>
    </div>
  </div>
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-value {
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary);
  font-weight: 600;
}

/* Accents */
.todo .stat-value { color: #94a3b8; }
.progress .stat-value { color: var(--primary); }
.done .stat-value { color: var(--success); }

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
