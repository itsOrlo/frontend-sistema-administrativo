import { createRouter, createWebHistory } from 'vue-router';
import autenticacionRoutes from '../modules/autenticacion/routes';
import dashboardRoutes from '../modules/dashboard/routes';
import consultoriaRoute from '@/modules/consultoria/routes'
import mantenimientoRoute from '@/modules/mantenimiento/routes'

const router = createRouter({
  history: createWebHistory(/*import.meta.env.BASE_URL*/),
  routes: [
    ...autenticacionRoutes,
    ...dashboardRoutes,
    ...consultoriaRoute,
    ...mantenimientoRoute,

    {
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: () => import('../components/ui/NotFoundComponent.vue'),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token');
  const userPrivilege = localStorage.getItem('privilege'); // Obtener el privilegio del usuario
  
  // Si la ruta requiere autenticación
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: 'login' });
    } else if (userPrivilege === '0' && to.name !== 'bienvenidoUsuario') {
      next({ name: 'bienvenidoUsuario' }); // Redirige a la ruta de bienvenida si el privilegio es "0"
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
  // Si el usuario está autenticado y trata de acceder a la ruta de login
  else if (isAuthenticated && to.path === '/') {
    if (userPrivilege === '0') {
      next({ name: 'bienvenidoUsuario' }); // Redirige a la ruta de bienvenida si el privilegio es "0"
    } else {
      next({ name: 'consultoriaClientes' }); // Redirige al dashboard si ya está autenticado
    }
  }
  // Para todas las demás rutas
  else {
    next();
  }
});

export default router;
