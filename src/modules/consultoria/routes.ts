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
        path: '/listarDependencias',
        name: 'listadoDependencias',
        component: () => import('./pages/ListadoDependencias.vue'),
        meta: { requiresAuth: true }, 
    },
    {
        path: '/listarConsultorias',
        name: 'listadoConsultorias',
        component: () => import('./pages/ListadoConsultorias.vue'),
        meta: { requiresAuth: true }, 
    },
    {
        path: '/bienvenido',
        name: 'bienvenidoUsuario',
        component: () => import('./pages/BienvenidoUsuario.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/faq',
        name: 'faqPage',
        component: () => import('./pages/FaqPage.vue'),
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
