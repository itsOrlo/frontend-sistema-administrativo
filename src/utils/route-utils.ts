import { type Router } from 'vue-router';
import type { RutaInterface } from '@/modules/dashboard/dto/menu-rutas-response.dto';
import type { RutaDto } from '@/modules/autenticacion/dto/login-response.dto';
import { parseObjectRutas } from '@/modules/dashboard/helpers/parse-object-rutas'; // Ajusta la importación según tu estructura

// 🔹 Función recursiva para convertir `RutaInterface` en `RutaDto`
const convertirRutaInterfaceARutaDto = (ruta: RutaInterface): RutaDto => ({
    ...ruta,
    ruta_creada: new Date().toISOString(), // Fecha actual
    ruta_actualizada: new Date().toISOString(), // Fecha actual
    ruta_estado: true, // Estado predeterminado
    rutasHijas: ruta.rutasHijas ? ruta.rutasHijas.map(convertirRutaInterfaceARutaDto) : [], // Recursión para rutas hijas
});

// 🔹 Función para obtener y agregar rutas al enrutador
export const fetchRoutes = async (router: Router, rutas: RutaInterface[] = []) => {
    console.log('🔄 Llamando a fetchRoutes...');

    if (rutas.length === 0) {
        console.log('⚠️ No hay rutas proporcionadas, intentando recuperar desde localStorage...');
        rutas = JSON.parse(localStorage.getItem('rutas') || '[]');
    }

    if (rutas.length === 0) {
        console.warn('⚠️ No hay rutas disponibles para configurar.');
        return;
    }

    console.log('✅ Rutas a configurar:', rutas);

    // 🔹 Convertir `RutaInterface[]` a `RutaDto[]` usando la función recursiva
    const rutasDto: RutaDto[] = rutas.map(convertirRutaInterfaceARutaDto);

    // 🔹 Llamar a `parseObjectRutas()` con las rutas corregidas
    await parseObjectRutas(router, rutasDto);

    console.log('✅ Rutas configuradas correctamente');
};
// 🔹 Función para eliminar rutas dinámicas al cerrar sesión
export const removeRoutesOnLogout = (router: Router) => {
    console.log('🗑 Eliminando rutas dinámicas al cerrar sesión...');

    router.getRoutes().forEach((route) => {
        const rutasExcluidas = ['dashboard', 'login', 'not-found']; // Rutas que no se eliminan
        if (!rutasExcluidas.includes(route.name as string)) {
            console.log(`❌ Eliminando ruta: ${String(route.name)}`);
            router.removeRoute(route.name as string);
        }
    });

    // 🔹 Limpiar el LocalStorage
    localStorage.removeItem('rutas');

    console.log('✅ Rutas eliminadas correctamente');
};