<template>
  <div>
    <!-- Start Table -->
    <div class="overflow-x-auto table-responsive">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <!-- Asignado dinámico de cabecera -->
            <th v-for="(cabecera, index) in cabecerasVisibles" :key="index" scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {{ cabecera }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="dependencia in dependencias" :key="dependencia.cdep_id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 dark:text-gray-100">{{ dependencia.cdep_id }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 dark:text-gray-100">{{ dependencia.cdep_dependencia }}</div>
            </td>
            <td v-if="mostrarBotones" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                @click="$emit('editar', dependencia)">
                Editar
              </button>
              <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                @click="$emit('eliminar', dependencia)">
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- End Table -->

    <!-- Botón para exportar a Excel -->
    <div class="mt-4 flex justify-end">
      <button v-if="mostrarBotones" @click="exportarExcel"
        class="bg-green-600 text-gray-100 hover:bg-green-800 font-bold py-2 px-4 rounded flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path
            d="M3 3a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V3zm2 0v14h10V3H5zm3 4h4v2H8V7zm0 4h4v2H8v-2z" />
        </svg>
        Exportar a Excel
      </button>
    </div>

    <!-- Pagination with improved design -->
    <div class="mt-6 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 sm:px-6">
      <div class="flex flex-1 justify-between items-center">
        <div>
          <p class="text-sm text-gray-700 dark:text-gray-300">
            Mostrando página <span class="font-medium">{{ currentPage }}</span> de
            <span class="font-medium">{{ totalPages }}</span>
          </p>
        </div>
        <div class="flex gap-2">
          <button @click="$emit('cambiar-pagina', currentPage - 1)" :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm"
            :class="{
              'hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0': currentPage !== 1,
              'opacity-50 cursor-not-allowed': currentPage === 1,
            }">
            <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Anterior
          </button>

          <button @click="$emit('cambiar-pagina', currentPage + 1)" :disabled="currentPage === totalPages"
            class="relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm"
            :class="{
              'hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0': currentPage !== totalPages,
              'opacity-50 cursor-not-allowed': currentPage === totalPages,
            }">
            Siguiente
            <svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
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
import { onMounted, ref, computed } from 'vue';
import * as XLSX from 'xlsx';
import { useDependencia } from '../composables/useDependencias';

const autenticacionStore = useAutenticacionStore();
const mostrarBotones = ref(false);

// Computed property para determinar si se deben mostrar los botones
onMounted(() => {
  mostrarBotones.value = autenticacionStore.privilegio === 1;
});

// Computed property para las cabeceras visibles
const cabecerasVisibles = computed(() => {
  return props.cabecerasTabla;
});

const props = defineProps({
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

const { loadDepends, dependencias } = useDependencia();

const exportarExcel = async () => {
  try {
    await loadDepends();
    const datosParaExportar = dependencias.value.map((dependencia) => {
      const { cdep_id, cdep_dependencia, cdep_fecha_registro, cdep_estado } = dependencia;
      return {
        ID: cdep_id,
        Dependencia: cdep_dependencia,
        'Fecha de Registro': cdep_fecha_registro,
        Estado: cdep_estado === 1 ? 'Activo' : 'Inactivo'
      };
    });

    const ws = XLSX.utils.json_to_sheet(datosParaExportar);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Dependencias');
    XLSX.writeFile(wb, 'dependencias.xlsx');
  } catch (error) {
    console.error('Error exportando a Excel:', error);
  }
};
</script>
