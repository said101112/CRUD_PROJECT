import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/projects/new',
      name: 'project-create',
      component: () => import('../views/ProjectCreateView.vue')
    },
    {
      path: '/projects/:id/edit',
      name: 'project-edit',
      component: () => import('../views/ProjectEditView.vue')
    }
  ]
});

export default router;
