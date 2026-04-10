<script setup>
import { computed } from 'vue';
import { ArrowUpCircle, ArrowRightCircle, ArrowDownCircle, AlertCircle } from 'lucide-vue-next';

const props = defineProps({
  priority: {
    type: String,
    required: true
  }
});

const priorityDetails = computed(() => {
  switch (props.priority) {
    case 'LOW': return { label: 'Low', class: 'prio-low', icon: ArrowDownCircle };
    case 'MEDIUM': return { label: 'Medium', class: 'prio-medium', icon: ArrowRightCircle };
    case 'HIGH': return { label: 'High', class: 'prio-high', icon: ArrowUpCircle };
    case 'CRITICAL': return { label: 'Critical', class: 'prio-critical', icon: AlertCircle };
    default: return { label: props.priority, class: 'prio-medium', icon: ArrowRightCircle };
  }
});
</script>

<template>
  <span class="priority" :class="priorityDetails.class">
    <component :is="priorityDetails.icon" :size="14" />
    {{ priorityDetails.label }}
  </span>
</template>

<style scoped>
.priority {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.prio-low { color: var(--success); }
.prio-medium { color: var(--warning); }
.prio-high { color: #f97316; } /* Orange */
.prio-critical { color: var(--danger); font-weight: 600; }
</style>
