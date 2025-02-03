import type { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/perfiles',
    name: 'perfiles',
    component: () => import('./pages/PerfilesPage.vue'),
    meta: { requiresAuth: true }, 
  },
  {
    path: '/perfil-settings',
    name: 'perfil-settings',
    component: () => import('./pages/PerfilSettings.vue'),
    meta: { requiresAuth: true }, 
  },
  {
    path: '/perfil-launch',
    name: 'perfil-launch',
    component: () => import('./pages/LaunchPage.vue'),
    meta: { requiresAuth: true }, 
  },
  {
    path: '/perfil-summary',
    name: 'perfil-summary',
    component: () => import('./pages/PerfilSummary.vue'),
    meta: { requiresAuth: true }, 
  },
];

export default routes;
