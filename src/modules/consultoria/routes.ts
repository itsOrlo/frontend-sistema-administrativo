import type { RouteRecordRaw } from 'vue-router';

export const routes: Array<RouteRecordRaw> = [
    {
        path: '/consultoria',
        name: 'consultoria',
        component: () => import('./pages/ConsultoriaPage.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/empresas',
        name: 'empresas',
        component: () => import('./pages/EmpresasPage.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/dependencias',
        name: 'dependencias',
        component: () => import('./pages/DependenciasPage.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/consultoria-listado',
        name: 'consultoria-listado',
        component: () => import('./pages/ListadoConsultorias.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/bienvenidos',
        name: 'bienvenidos',
        component: () => import('./pages/BienvenidosPage.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/faq',
        name: 'faq',
        component: () => import('./pages/FAQPage.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/mantenimiento',
        name: 'mantenimiento',
        component: () => import('./pages/MantenimientoPage.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/inventario',
        name: 'inventario',
        component: () => import('./pages/InventarioPage.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/mantenimiento-preventivo',
        name: 'mantenimiento-preventivo',
        component: () => import('./pages/MantenimientoPreventivoPage.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/administracion-catalogos',
        name: 'administracion-catalogos',
        component: () => import('./pages/AdministracionCatalogosPage.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/reporte-inventario',
        name: 'reporte-inventario',
        component: () => import('./pages/ReporteInventarioPage.vue'),
        meta: { requiresAuth: true },
    },
];

export default routes;
