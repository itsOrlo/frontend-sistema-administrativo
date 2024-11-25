import { createRouter, createWebHistory } from 'vue-router';
import autenticacionRoutes from '../modules/autenticacion/routes';
import dashboardRoutes from '../modules/dashboard/routes';
import perfilesRoutes from '../modules/perfiles/routes';
import curriculumRoutes from '../modules/curriculum/routes';
import KnowledgeRoutes from '@/modules/conocimiento/routes';
import CompetenciasRoute from '@/modules/competencias/routes';
import videoEntrevistaRoute from '@/modules/entrevista/routes';
import consultoriaRoute from '@/modules/consultoria/routes'

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
    ...consultoriaRoute,
    {
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: () => import('../components/ui/NotFoundComponent.vue'),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token');
  
  // Si la ruta requiere autenticación
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: 'login' });
    } else {
      next();
    }
  } 
  // Si la ruta es de autenticación (login, registro, etc.)
  else if (to.matched.some((record) => record.meta.isAuthRoute)) {
    if (isAuthenticated) {
      next({ name: 'dashboard' }); // Redirige al dashboard si ya está autenticado
    } else {
      next();
    }
  }
  // Para todas las demás rutas
  else {
    next();
  }
});




export default router;
