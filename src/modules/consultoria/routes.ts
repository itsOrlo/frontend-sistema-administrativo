import type { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
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
    
];

export default routes;
