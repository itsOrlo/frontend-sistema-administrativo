import type { RouteRecordRaw } from 'vue-router';

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/mantenimiento',
    name: 'mantenimiento',
    component: () => import('./pages/MantenimientoPage.vue'),
    meta: { requiresAuth: true },
  },
];

export default routes;
