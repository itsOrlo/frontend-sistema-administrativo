import { type Router } from 'vue-router';
import type { RutaDto } from '@/modules/autenticacion/dto/login-response.dto';

// 🔹 Función para obtener rutas desde localStorage
const obtenerRutasDesdeLocalStorage = (): RutaDto[] => {
  const rutasJSON = localStorage.getItem('rutas');
  return rutasJSON ? (JSON.parse(rutasJSON) as RutaDto[]) : [];
};

// 🔹 Función para generar una ruta válida y corregida
const obtenerRutaValida = (ruta: string): string => {
  let rutaCorregida = ruta.trim();

  // 🔸 Si la ruta comienza con "/", quitarla para hacerla relativa
  if (rutaCorregida.startsWith('/')) {
    rutaCorregida = rutaCorregida.substring(1);
  }

  // 🔸 Si la ruta tiene "@/modules", lo dejamos tal cual, sino la corregimos
  if (!rutaCorregida.startsWith('@/')) {
    rutaCorregida = `@/${rutaCorregida}`;
  }

  console.log(`🔹 Ruta corregida del componente: ${rutaCorregida}`);
  return rutaCorregida;
};

// 🔹 Función para procesar y agregar rutas dinámicamente a Vue Router
export const parseObjectRutas = async (router: Router, rutas: RutaDto[] = []) => {
  if (!router) {
    throw new Error('❌ El objeto router no está definido.');
  }

  // 🔸 Si no se pasan rutas, intentar obtenerlas desde localStorage
  if (rutas.length === 0) {
    console.log('⚠️ No se pasaron rutas, obteniendo desde localStorage...');
    rutas = obtenerRutasDesdeLocalStorage();
  }

  if (rutas.length === 0) {
    console.warn('⚠️ No hay rutas almacenadas en localStorage.');
    return;
  }

  console.log('✅ Rutas cargadas:', rutas);

  // 🔹 Obtener rutas existentes en Vue Router
  const existingRoutes = router.getRoutes().map((route) => route.name);
  console.log('📌 Rutas ya registradas en Vue Router:', existingRoutes);

  // 🔹 Agregar rutas nuevas si no están registradas
  for (const ruta of rutas) {
    if (!existingRoutes.includes(ruta.ruta_ruta)) {
      console.log(`🛠 Agregando ruta dinámica: ${ruta.ruta_nombre}`);

      // 🔹 Obtener la ruta corregida del componente
      const sanitizedComponentPath = obtenerRutaValida(ruta.ruta_component);

      console.log(`🔹 Ruta corregida del componente: ${sanitizedComponentPath}`);

      try {
        // 🔍 PRUEBA IMPORTARLO MANUALMENTE ANTES PARA VER SI EXISTE
        await import(/* @vite-ignore */ sanitizedComponentPath);
        console.log(`✅ Importación de prueba exitosa para ${sanitizedComponentPath}`);

        // 📌 Agregar la ruta dinámica a Vue Router
        router.addRoute({
          path: ruta.ruta_url,
          name: ruta.ruta_ruta,
          component: () => import(/* @vite-ignore */ sanitizedComponentPath).catch((err) => {
            console.error(
              `❌ Error al importar el módulo dinámicamente: ${sanitizedComponentPath}`,
              err,
            );
          }),
          meta: {
            requiresAuth: true,
            transition: 'fade',
          },
        });
      } catch (error) {
        console.error(`❌ Error al probar la importación de ${sanitizedComponentPath}`, error);
      }
    }
  }

  console.log('✅ Rutas dinámicas registradas correctamente.');
};

// 🔹 Función para registrar rutas dinámicas cuando se inicia la app
export const setupDynamicRoutes = async (router: Router) => {
  console.log('🔄 Configurando rutas dinámicas al iniciar la aplicación...');

  const rutas = obtenerRutasDesdeLocalStorage();
  if (rutas.length === 0) {
    console.warn('⚠️ No hay rutas almacenadas en localStorage.');
    return;
  }

  await parseObjectRutas(router, rutas);
  console.log('✅ Rutas dinámicas configuradas correctamente.');
};

// 🔹 Función mejorada para eliminar rutas dinámicas al cerrar sesión
export const removeRoutesOnLogout = (router: Router) => {
  console.log('🗑 Eliminando rutas dinámicas al cerrar sesión...');

  // 🔹 Obtener rutas existentes y eliminarlas si no son rutas básicas
  router.getRoutes().forEach((route) => {
    const rutasExcluidas = ['dashboard', 'login', 'not-found']; // Rutas que no se eliminan
    if (route.name && !rutasExcluidas.includes(route.name as string)) {
      console.log(`❌ Eliminando ruta: ${String(route.name)}`);
      router.removeRoute(route.name as string);
    }
  });

  // 🔹 Limpiar rutas del LocalStorage
  localStorage.removeItem('rutas');

  console.log('✅ Rutas eliminadas correctamente.');

  // 🔹 Redirigir al login después de cerrar sesión
  setTimeout(() => {
    router.replace({ name: 'login' }).then(() => {
      console.log('🔄 Recargando la aplicación para limpiar caché de rutas...');
      window.location.reload(); // 🔥 Recarga la app para limpiar rutas en memoria
    });
  }, 500);
};
