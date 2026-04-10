<script setup>
import { RouterView, RouterLink } from 'vue-router'
import { LayoutDashboard, PlusCircle } from 'lucide-vue-next'
</script>

<template>
  <div class="app-layout">
    <header class="glass-panel main-header">
      <div class="header-content">
        <RouterLink to="/" class="logo">
          <LayoutDashboard :size="24" class="logo-icon"/>
          <span>ProjectMaster</span>
        </RouterLink>
        <nav>
          <RouterLink to="/projects/new" class="btn btn-primary">
            <PlusCircle :size="18" />
            New Project
          </RouterLink>
        </nav>
      </div>
    </header>

    <main class="container">
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-header {
  position: sticky;
  top: 0;
  z-index: 50;
  border-radius: 0;
  border-top: none;
  border-left: none;
  border-right: none;
}

.header-content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.5px;
}

.logo-icon {
  color: var(--primary);
}
</style>
