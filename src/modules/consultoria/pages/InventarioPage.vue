<template>
  <DashboardLayout class="text-xs md:text-sm">
    <!-- PRIMER CONTENEDOR: BARRA Y MENÚ -->
    <div class="relative z-10">
      <!-- Barra superior azul -->
      <div class="mt-3 flex flex-wrap items-center bg-sky-400 px-4 py-2 text-white font-bold">
        <div class="flex items-center bg-gray-800 px-3 py-2 rounded-md">
          <img src="/logopuce-si1.png" alt="PUCE Sede Ibarra" class="h-10" />
        </div>
        <div class="flex items-center gap-3 ml-4">
          <!-- Ajusta el tamaño de los íconos y texto para pantallas pequeñas/grandes -->
          <i class="fas fa-tools text-2xl md:text-4xl text-white"></i>
          <span class="text-xl md:text-4xl font-bold text-white">
            Sistema Mantenimiento
          </span>
        </div>
      </div>

      <!-- Menú principal -->
      <div ref="menuRef" class="relative z-10">
        <div class="bg-gray-800 text-white py-2 md:py-4 px-4 md:px-6 flex items-center">
          <div
            class="flex items-center cursor-pointer text-sm md:text-xl"
            @click="toggleMenu"
          >
            <i class="fas fa-briefcase mr-2 md:mr-3 text-lg md:text-2xl"></i>
            <span class="font-bold text-lg md:text-2xl">SISTEMA MANTENIMIENTO</span>
            <i class="fas fa-chevron-right ml-2 md:ml-3 text-lg md:text-2xl"></i>
          </div>
        </div>

        <!-- Menú desplegable dinámico -->
        <div
          v-if="menuOpen"
          class="absolute bg-white shadow-lg mt-1 w-64 md:w-80 py-2 px-3 rounded-lg"
        >
          <div
            v-for="(submenu, index) in menuItems"
            :key="index"
            class="relative group"
          >
            <div
              class="flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer text-sm md:text-base font-bold"
              @mouseover="openSubmenu(submenu)"
              @click="navigateTo(submenu.ruta_url)"
            >
              <i class="fas fa-folder mr-2 md:mr-3 text-lg md:text-2xl"></i>
              <span class="font-semibold">{{ submenu.ruta_nombre }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CONTENIDO PRINCIPAL -->
    <!-- Ajusta el padding para pantallas pequeñas y grandes -->
    <div class="p-3 md:p-6">
      <!-- TÍTULO -->
      <!-- Ajusta el tamaño de fuente en móviles vs. pantallas grandes -->
      <h1 class="text-xl md:text-3xl font-bold">
        <span class="text-black">Inventario</span>
        <span class="text-gray-500 ml-1">Equipos de computo</span>
      </h1>

      <!-- FORMULARIO -->
      <div class="bg-white shadow-md p-4 md:p-6 mt-4 rounded-md">
        <label
          for="catalogo"
          class="block text-gray-700 font-bold text-sm md:text-base mb-2"
        >
          Catálogo
        </label>
        <select
          id="catalogo"
          class="border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-300
                 h-10 md:h-12 px-2 md:px-3 text-xs md:text-sm w-full sm:w-64 md:w-72 appearance-none"
        >
          <option>[Seleccione]</option>
        </select>
      </div>

      <!-- TABLA DE INVENTARIO -->
      <div class="mt-4 md:mt-6">
        <InventarioMantenimientoTable />
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import DashboardLayout from '@/modules/dashboard/layouts/DashboardLayout.vue';
import { obtenerRutasConPadre7 } from '@/modules/dashboard/helpers/parse-object-rutas';
import InventarioMantenimientoTable from '@/modules/consultoria/components/InventarioMantenimientoTable.vue';
import type { Ruta } from '@/modules/consultoria/dto/RutaMantenimiento.dto';

const router = useRouter();
const menuOpen = ref<boolean>(false);
const menuRef = ref<HTMLElement | null>(null);
const menuItems = ref<Ruta[]>([]);

// Alternar el menú
const toggleMenu = (): void => {
  menuOpen.value = !menuOpen.value;
};

// Abrir submenú cuando el usuario pasa el mouse
const openSubmenu = (submenu: Ruta): void => {
  menuItems.value.forEach((item) => {
    if (item !== submenu) item.open = false;
  });
  submenu.open = true;
};

// Navegación a una ruta específica
const navigateTo = (url: string): void => {
  menuOpen.value = false;
  router.push(url);
};

// Cerrar menú cuando se hace clic fuera
const handleClickOutside = (event: Event): void => {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    menuOpen.value = false;
  }
};

// Obtener rutas dinámicamente al montar
onMounted(() => {
  document.addEventListener('click', handleClickOutside);

  const rutasMantenimiento = obtenerRutasConPadre7();
  console.log('🛠 Rutas de mantenimiento cargadas en el menú:', rutasMantenimiento);

  menuItems.value = rutasMantenimiento.map((ruta: any) => ({
    ruta_nombre: ruta.ruta_nombre,
    ruta_url: ruta.ruta_url,
    open: false,
  }));
});

// Eliminar eventos al desmontar
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
