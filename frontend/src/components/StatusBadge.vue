<script setup>
import { computed } from 'vue';

const props = defineProps({
  status: {
    type: String,
    required: true
  }
});

const statusDetails = computed(() => {
  switch (props.status) {
    case 'TODO': return { label: 'To Do', class: 'status-todo' };
    case 'IN_PROGRESS': return { label: 'In Progress', class: 'status-progress' };
    case 'DONE': return { label: 'Done', class: 'status-done' };
    default: return { label: props.status, class: 'status-todo' };
  }
});
</script>

<template>
  <span class="badge" :class="statusDetails.class">
    <span class="dot"></span>
    {{ statusDetails.label }}
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-todo {
  background-color: rgba(148, 163, 184, 0.15);
  color: var(--text-secondary);
}
.status-todo .dot { background-color: var(--text-secondary); }

.status-progress {
  background-color: rgba(59, 130, 246, 0.15);
  color: var(--primary);
}
.status-progress .dot { background-color: var(--primary); }

.status-done {
  background-color: rgba(16, 185, 129, 0.15);
  color: var(--success);
}
.status-done .dot { background-color: var(--success); }
</style>
