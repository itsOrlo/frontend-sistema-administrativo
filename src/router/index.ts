import { createRouter, createWebHistory } from 'vue-router';
import autenticacionRoutes from '../modules/autenticacion/routes';
import dashboardRoutes from '../modules/dashboard/routes';
import perfilesRoutes from '../modules/perfiles/routes';
import curriculumRoutes from '../modules/curriculum/routes';
import KnowledgeRoutes from '@/modules/conocimiento/routes';
import CompetenciasRoute from '@/modules/competencias/routes';
import videoEntrevistaRoute from '@/modules/entrevista/routes';

const router = createRouter({
  history: createWebHistory(/*import.meta.env.BASE_URL*/),
  routes: [
    ...autenticacionRoutes,
    ...dashboardRoutes,
    ...perfilesRoutes,
    ...curriculumRoutes,
    ...KnowledgeRoutes,
    ...CompetenciasRoute,
    ...videoEntrevistaRoute,
    {
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: () => import('../components/ui/NotFoundComponent.vue'),
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const autenticacionLocalStorage = JSON.parse(localStorage.getItem('autenticacion') || '{}');
    if (!autenticacionLocalStorage['loginStatus']) {
      next({ name: 'login' });
    } else {
      next();
    }
  } else {
    next();
  }
});


export default router;
