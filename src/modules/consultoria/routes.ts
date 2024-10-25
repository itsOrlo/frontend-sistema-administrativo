import type { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    {
        
        path: '/listar',
        name: 'listadoCliente',
        component: () => import('./pages/ListadoClientes.vue'),
        meta: { requiresAuth: true }, 
    },
    /* {
        
        path: '/crear-clientes',
        name: 'crearlistadoCliente',
        component: () => import('./components/ModalWrapperRegistroClientes.vue'),
        meta: { requiresAuth: true }, 
    }, */
    
];

export default routes;
