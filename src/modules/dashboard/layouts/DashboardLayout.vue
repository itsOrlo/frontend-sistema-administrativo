<template>
  <div class="relative min-h-screen">
    <!-- Overlay -->
    <div v-if="sidebarOpen" class="fixed inset-0 bg-gray-500 bg-opacity-30 backdrop-blur-sm z-30"
      @click="toggleSidebar"></div>

    <!-- Sidebar -->
    <aside :class="['fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform transform bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700',
      sidebarOpen ? 'translate-x-0' : '-translate-x-full']" aria-label="Sidebar">
      <div class="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
        <ul class="space-y-2 font-medium">
          <!-- Rutas -->
          <li v-for="(item, index) in rutas" :key="index">
            <a @click="navigation(item.ruta_ruta)"
              class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 hover:cursor-pointer dark:hover:bg-gray-700 group">
              <span class="ms-1">{{ item.ruta_nombre }}</span>
            </a>
            <div v-if="item.rutasHijas?.length">
              <ul>
                <li v-for="(subItem, subIndex) in item.rutasHijas" :key="subIndex">
                  <a @click="navigation(subItem.ruta_nombre)"
                    class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 hover:cursor-pointer dark:hover:bg-gray-700 group">
                    <span class="ms-4 font-thin">{{ subItem.ruta_nombre }}</span>
                  </a>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </aside>

    <!-- Contenido Principal -->
    <div :class="{ 'overflow-hidden': sidebarOpen }" class="transition-transform duration-300">
      <nav class="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div class="px-3 py-3 lg:px-5 lg:pl-3">
          <div class="flex items-center justify-between">
            <!-- Logo -->
            <div class="flex items-center justify-start rtl:justify-end">
              <button @click="toggleSidebar" aria-controls="logo-sidebar" type="button"
                class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                <span class="sr-only">Open sidebar</span>
                <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg">
                  <path clip-rule="evenodd" fill-rule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z">
                  </path>
                </svg>
              </button>
              <div @click="router.push({ name: 'dashboard', replace: true })" class="flex ms-2 md:me-24 cursor-pointer">
                <img
                  src="https://res.cloudinary.com/dx7qfps6d/image/upload/v1689608536/dev-deploys/eqayqo984zyobeq6zzxf.png"
                  class="h-11 me-3" alt="Puce Ibarra Logo" />
              </div>
            </div>
            <!-- Icon Profile -->
            <div class="flex items-center">
              <div class="flex items-center ms-3">
                <div>
                  <button type="button"
                    class="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                    aria-expanded="false" data-dropdown-toggle="dropdown-user">
                    <span class="sr-only">Open user menu</span>
                    <img class="w-8 h-8 rounded-full"
                      src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="user photo">
                  </button>
                </div>
                <div
                  class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600"
                  id="dropdown-user">
                  <div class="px-4 py-3" role="none">
                    <p class="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
                      {{ store.nombre }}
                    </p>
                  </div>
                  <ul class="py-1" role="none">
                    <li>
                      <div>
                        <span
                          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:cursor-pointer dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                          role="menuitem">Cambiar tema</span>
                      </div>
                    </li>
                    <li>
                      <span @click="logout()"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:cursor-pointer dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                        role="menuitem">Cerrar Sesión</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div class="pt-14">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAutenticacionStore } from '@/stores/use-autenticacion.store';
import { useRouter } from 'vue-router';
import { parseObjectRutas, removeRoutesOnLogout } from '../helpers/parse-object-rutas';
import type { RutaInterface } from '../dto/menu-rutas-response.dto';
import { personalDb, estudiantesDb } from '@/indexed-db';
import { initFlowbite } from 'flowbite';

const store = useAutenticacionStore();
const router = useRouter();
const sidebarOpen = ref(false);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const logout = () => {
  store.onLogout();
  removeRoutesOnLogout(router);
  estudiantesDb.closeDbEstudiantes();
  personalDb.closeDbPersonal();
  router.push({ name: 'login', replace: true });
};

// const autenticacionStorage = JSON.parse(localStorage.getItem('autenticacion') || '{}');
const rutas = ref<RutaInterface[]>([]);

const fetchRoutes = async () => {
  const rutasParseadas = await parseObjectRutas(router);
  rutas.value = rutasParseadas;
  store.updateRutas(rutas.value);
};

onMounted(() => {
  initFlowbite();
  fetchRoutes();
  personalDb.openDbPersonal();
  estudiantesDb.openDbEstudiantes();
});

// watchEffect(() => {
//   fetchRoutes();
// });

const navigation = (routeName?: string) => {
  if (!routeName || routeName === '') return;
  console.log("route name",routeName)
  router.push({ name: routeName });
};
</script>
