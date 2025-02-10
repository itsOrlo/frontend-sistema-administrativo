import type { RouteRecordRaw } from 'vue-router';

export const routes: Array<RouteRecordRaw> = [
    {
        path: '/listar',
        name: 'listadoCliente',
        component: () => import('./pages/ListadoClientes.vue'),
        meta: { requiresAuth: true }, 
    },
    {
        path: '/consultoria-clientes',
        name: 'consultoriaClientes',
        component: () => import('./pages/ConsultoriaClienetesPage.vue'),
        meta: { requiresAuth: true }, 
    },
    {
        path: '/sistemaMantenimiento',
        name: 'SistemaMantenimientoPage',
        component: () => import('./pages/SistemaMantenimientoPage.vue'),
        meta: { requiresAuth: true }, 
    },
    {
        path: '/listarConsultorias',
        name: 'listadoConsultorias',
        component: () => import('./pages/ListadoConsultorias.vue'),
        meta: { requiresAuth: true }, 
    },
   
    {
        path: '/faq',
        name: 'faqPage',
        component: () => import('./pages/FAQPage.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/centro-actividades/:tramite',
        name: 'centroActividades',
        component: () => import('./pages/CentroActividades.vue'),
        meta: { requiresAuth: true },
    },
];

export default routes;
