import type { RouteRecordRaw } from 'vue-router';

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/sistemaMantenimiento',
    name: 'SistemaMantenimientoPage',
    component: () => import('./pages/SistemaMantenimientoPage.vue'),
    meta: { requiresAuth: true },
  },
];

export default routes;
