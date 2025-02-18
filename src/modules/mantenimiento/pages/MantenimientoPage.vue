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
          <!-- Ícono y texto con tamaños responsivos -->
          <i class="fas fa-tools text-white text-2xl md:text-4xl"></i>
          <span class="text-white text-xl md:text-4xl font-bold">
            Sistema Mantenimiento
          </span>
        </div>
      </div>

      <!-- Menú principal -->
      <div ref="menuRef" class="relative z-10">
        <div class="bg-gray-800 text-white py-2 md:py-3 px-4 md:px-6 flex items-center">
          <div
            class="flex items-center cursor-pointer text-sm md:text-lg"
            @click="toggleMenu"
          >
            <i class="fas fa-briefcase mr-2 text-base md:text-2xl"></i>
            <span class="font-bold text-base md:text-xl">SISTEMA MANTENIMIENTO</span>
            <i class="fas fa-chevron-right ml-2 text-base md:text-xl"></i>
          </div>
        </div>

        <!-- Menú desplegable dinámico -->
        <div
          v-if="menuOpen"
          class="absolute bg-white shadow-lg mt-1 w-52 md:w-64"
        >
          <div
            v-for="(submenu, index) in menuItems"
            :key="index"
            class="relative group"
          >
            <div
              class="flex items-center px-4 py-2 md:py-3 hover:bg-gray-200 cursor-pointer text-xs md:text-sm"
              @mouseover="openSubmenu(submenu)"
              @click="navigateTo(submenu.ruta_url)"
            >
              <i class="fas fa-folder mr-2 text-sm md:text-base"></i>
              <span class="font-semibold">{{ submenu.ruta_nombre }}</span>
              <i class="fas fa-chevron-right ml-auto text-sm md:text-base"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- SEGUNDO CONTENEDOR: IMAGEN DE FONDO FUNCIONAL -->
    <!-- Ajustamos la altura mínima para pantallas pequeñas/grandes -->
    <div class="relative mt-8 flex justify-center items-center min-h-[150px] md:min-h-[200px]">
      <div
        class="absolute inset-0 w-full h-full bg-no-repeat bg-center bg-contain opacity-60 z-0"
        style="
          background-image: url('/logopuce-si.png');
          background-size: 40% auto;
          background-repeat: no-repeat;
          background-position: center;
        "
      ></div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import DashboardLayout from '@/modules/dashboard/layouts/DashboardLayout.vue';
import { obtenerRutasConPadre7 } from '@/modules/dashboard/helpers/parse-object-rutas';
import type { Ruta } from '@/modules/consultoria/dto/RutaMantenimiento.dto'; // 📌 Importando la interfaz correctamente

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

// Cerrar submenú cuando el mouse se va
const closeSubmenu = (submenu: Ruta): void => {
  submenu.open = false;
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
