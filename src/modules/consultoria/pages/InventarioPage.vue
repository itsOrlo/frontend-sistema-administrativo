<template>
  <DashboardLayout>
    <!-- PRIMER CONTENEDOR: BARRA Y MENÚ -->
    <div class="relative z-10">
      <!-- Barra superior azul -->
      <div class="mt-3 flex items-center bg-sky-400 px-4 py-2 text-white text-lg font-bold">
        <div class="flex items-center bg-gray-800 px-3 py-2 rounded-md">
          <img src="/logopuce-si1.png" alt="PUCE Sede Ibarra" class="h-10" />
        </div>
        <div class="flex items-center gap-3 ml-4">
          <i class="fas fa-tools text-white text-4xl"></i>
          <span class="text-white text-4xl font-bold">Sistema Mantenimiento</span>
        </div>
      </div>

      <!-- Menú principal -->
      <div ref="menuRef" class="relative z-10">
        <div class="bg-gray-800 text-white py-3 px-6 flex items-center">
          <div class="flex items-center cursor-pointer" @click="toggleMenu">
            <i class="fas fa-briefcase mr-2"></i>
            <span class="font-bold text-lg">SISTEMA MANTENIMIENTO</span>
            <i class="fas fa-chevron-right ml-2"></i>
          </div>
        </div>

        <!-- Menú desplegable -->
        <div v-if="menuOpen" class="absolute bg-white shadow-lg mt-1 w-64">
          <div v-for="(submenu, index) in menuItems" :key="index" class="relative group">
            <div
              class="flex items-center px-4 py-3 hover:bg-gray-200 cursor-pointer"
              @mouseover="openSubmenu(submenu)"
            >
              <i :class="submenu.icon + ' mr-2'"></i>
              <span class="font-semibold">{{ submenu.name }}</span>
              <i v-if="submenu.subOptions" class="fas fa-chevron-right ml-auto"></i>
            </div>

            <!-- Submenú -->
            <div
              v-if="submenu.open"
              class="absolute left-full top-0 bg-white shadow-lg w-64"
              @mouseleave="closeSubmenu(submenu)"
            >
              <div
                v-for="(option, idx) in submenu.subOptions"
                :key="idx"
                class="px-4 py-3 hover:bg-gray-200 cursor-pointer"
              >
                {{ option }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- CONTENIDO PRINCIPAL -->
    <div class="p-6">
      <!-- TÍTULO -->
      <h1 class="text-3xl font-bold">
        <span class="text-black">Inventario</span>
        <span class="text-gray-500"> Equipos de computo</span>
      </h1>

      <!-- FORMULARIO -->
      <div class="bg-white shadow-md p-6 mt-4 rounded-md">
        <label for="catalogo" class="block text-gray-700 font-bold text-xl mb-2"> Catálogo </label>
        <select
          id="catalogo"
          class="border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-300"
          style="height: 45px; padding: 8px; font-size: 16px; width: 300px; appearance: none"
        >
          <option>[Seleccione]</option>
        </select>
      </div>
    </div>

    <!-- SEGUNDO CONTENEDOR: IMAGEN DE FONDO FUNCIONAL -->
    <!-- <div class="relative mt-16 flex justify-center items-center min-h-[200px]"> -->
      <!-- Imagen de fondo asegurada -->
      <!-- <div
        class="absolute inset-0 w-full h-full bg-no-repeat bg-center bg-contain opacity-60 z-0"
        style="
          background-image: url('/logopuce-si.png');
          background-size: 40% auto;
          background-repeat: no-repeat;
          background-position: center;
        "
      ></div>
    </div> -->
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import DashboardLayout from '@/modules/dashboard/layouts/DashboardLayout.vue';

const menuOpen = ref(false);
const menuRef = ref(null);
const menuItems = ref([
  {
    name: 'Acciones',
    icon: 'fas fa-briefcase',
    open: false,
    subOptions: ['Crear', 'Editar', 'Eliminar'],
  },
  {
    name: 'Configuraciones',
    icon: 'fas fa-wrench',
    open: false,
    subOptions: ['Usuarios', 'Permisos', 'Preferencias'],
  },
  {
    name: 'Reportes',
    icon: 'fas fa-chart-bar',
    open: false,
    subOptions: ['Mensuales', 'Anuales', 'Personalizados'],
  },
]);

// Alternar menú con clic
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
  menuItems.value.forEach((item) => (item.open = false));
};

// Abre submenú al pasar el mouse
const openSubmenu = (submenu) => {
  menuItems.value.forEach((item) => {
    if (item !== submenu) item.open = false;
  });
  submenu.open = true;
};

// Cierra submenú cuando el mouse se va
const closeSubmenu = (submenu) => {
  submenu.open = false;
};

// Detectar clic fuera del menú
const handleClickOutside = (event) => {
  if (menuRef.value && !menuRef.value.contains(event.target)) {
    menuOpen.value = false;
    menuItems.value.forEach((item) => (item.open = false)); // Cierra submenús
  }
};

// Agregar y quitar event listener al montar/desmontar
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
