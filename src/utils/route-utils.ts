import {type Router } from 'vue-router';
import { parseObjectRutas } from '@/modules/dashboard/helpers/parse-object-rutas'; // Ajusta la importación según tu estructura

// Función para obtener y agregar rutas al enrutador
export const fetchRoutes = async (router: Router) => {
    console.log('Llamando a fetchRoutes'); // Debugging
    await parseObjectRutas(router);
    console.log('Rutas configuradas'); // Debugging
};
