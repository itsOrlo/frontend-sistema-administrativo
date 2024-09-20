import { type Router } from 'vue-router';
import type { RutaDto } from '@/modules/autenticacion/dto/login-response.dto';

// Función para obtener las rutas del localStorage
const obtenerRutasDesdeLocalStorage = () => {
  const rutasJSON = localStorage.getItem('rutas');
  if (rutasJSON) {
    return JSON.parse(rutasJSON) as RutaDto[];
  }
  return [];
};

export const parseObjectRutas = async (router: Router) => {
  if (!router) {
    throw new Error('El objeto router no está definido.');
  }

  const rutas: RutaDto[] = obtenerRutasDesdeLocalStorage();
  console.log('Rutas desde LocalStorage:', rutas); // Debugging
  // Obtener las rutas existentes en el enrutador
  const existingRoutes = router.getRoutes().map((route) => route.name);
  console.log('Rutas existentes:', existingRoutes); // Debugging

  // Añadir rutas nuevas al enrutador
  rutas.forEach((ruta) => {
    if (!existingRoutes.includes(ruta.ruta_ruta)) {
      router.addRoute({
        path: ruta.ruta_url,
        name: ruta.ruta_ruta,
        component: () => import(`../../../${ruta.ruta_component}`), // Importar dinámicamente el componente
        meta: {
          requiresAuth: true,
          transition: 'fade',
        },
      });
    }
  });

  

  // Procesar rutas padre e hija
  const rutasPadre = rutas.filter((ruta) => ruta.ruta_padre === 0);
  const rutasHijas = rutas.filter((ruta) => ruta.ruta_padre !== 0);
  const rutasParseadas = rutasPadre.map((rutaPadre) => {
    const rutasHijasParseadas = rutasHijas.filter((rutaHija) => rutaHija.ruta_padre === rutaPadre.ruta_id);
    return {
      ...rutaPadre,
      rutasHijas: rutasHijasParseadas,
    };
  });

  return rutasParseadas;
};


export const removeRoutesOnLogout = (router: Router) => {
  router.getRoutes().forEach((route) => {
    const arr = ['dashboard', 'login', 'not-found'];
    const isDeletable = arr.includes(route.name as string);

    if (!isDeletable) {
      router.removeRoute(route.name as string);
    }
  });
};

