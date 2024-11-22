<template>
  <div>
    <!-- Start Table -->
    <div class="overflow-x-auto table-responsive">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <!-- Asignado dinámico de cabecera -->
            <th
              v-for="(cabecera, index) in cabecerasTabla"
              :key="index"
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {{ cabecera }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="dependencia in dependencias" :key="dependencia.cdep_id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ dependencia.cdep_id }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ dependencia.cdep_dependencia }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ dependencia.cdep_fecha_registro }}</div>
            </td>

            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <button

                v-if="mostrarBotones"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                @click="$emit('editar', dependencia)"
              >
                Editar
              </button>
              <button
                class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                @click="$emit('eliminar', dependencia)"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- End Table -->

    <!-- Pagination with improved design -->
    <div
      class="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
    >
      <div class="flex flex-1 justify-between items-center">
        <div>
          <p class="text-sm text-gray-700">
            Mostrando página <span class="font-medium">{{ currentPage }}</span> de
            <span class="font-medium">{{ totalPages }}</span>
          </p>
        </div>
        <div class="flex gap-2">
          <button
            @click="$emit('cambiar-pagina', currentPage - 1)"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md bg-white text-gray-900 shadow-sm"
            :class="{
              'hover:bg-gray-50 focus:z-20 focus:outline-offset-0': currentPage !== 1,
              'opacity-50 cursor-not-allowed': currentPage === 1,
            }"
          >
            <svg
              class="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
            Anterior
          </button>

          <button
            @click="$emit('cambiar-pagina', currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md bg-white text-gray-900 shadow-sm"
            :class="{
              'hover:bg-gray-50 focus:z-20 focus:outline-offset-0': currentPage !== totalPages,
              'opacity-50 cursor-not-allowed': currentPage === totalPages,
            }"
          >
            Siguiente
            <svg
              class="ml-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { Dependencia } from '../composables/useDependencias';
import { useAutenticacionStore } from '@/stores/use-autenticacion.store';
import { computed, ref, watch } from 'vue';

const autenticacionStore = useAutenticacionStore();

// Variable reactiva para controlar la visibilidad de los botones
const mostrarBotones = ref(false); 

// Computed property para obtener el privilegio del store
const privilegio = computed(() => autenticacionStore.privilegio);

// Watch para observar los cambios en el privilegio
watch(privilegio, (nuevoPrivilegio) => {
  console.log("Privilegio actualizado:", nuevoPrivilegio);
  mostrarBotones.value = nuevoPrivilegio === 1;
});

defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  cabecerasTabla: {
    type: Array as PropType<string[]>,
    required: true,
  },
  dependencias: {
    type: Array as PropType<Dependencia[]>, // Aquí especificamos el tipo
    required: true,
  },
});
defineEmits(['editar', 'eliminar', 'cambiar-pagina']);
</script>
