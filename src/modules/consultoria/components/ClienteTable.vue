<template>
  <div>
    <!-- Filtro de Tipo de Empresa -->
    <div class="mb-4">
      <label for="tipoEmpresa" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Filtrar por Tipo de Empresa</label>
      <select id="tipoEmpresa" v-model="filtroTipoEmpresa" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300">
        <option value="">Todos</option>
        <option v-for="(nombre, id) in tiposEmpresa" :key="id" :value="id">{{ nombre }}</option>
      </select>
    </div>

    <!-- Start Table -->
    <div class="overflow-x-auto table-responsive">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <!-- Asignado dinámico de cabecera -->
            <th
              v-for="(cabecera, index) in cabecerasVisibles"
              :key="index"
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {{ cabecera }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="cliente in clientesFiltrados" :key="cliente.Ruc">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 dark:text-gray-300">{{ cliente.Empresa }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 dark:text-gray-300">{{ cliente.Ruc }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 dark:text-gray-300">{{ cliente.Contacto }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500 dark:text-gray-400">{{ cliente.Correo }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500 dark:text-gray-400">{{ cliente.Teléfono }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              <div :class="{
                'bg-purple-500 text-gray-100': tiposEmpresa[cliente['Tipo de empresa']] === 'Pública',
                'bg-pink-500 text-gray-100': tiposEmpresa[cliente['Tipo de empresa']] === 'Privada',
              }" class="inline-block px-3 py-1 rounded-full font-semibold">
                {{ tiposEmpresa[cliente['Tipo de empresa']] || 'Desconocido' }}
              </div>
            </td>
            <td v-if="mostrarBotones" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              <button
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                @click="$emit('editar', cliente)"
              >
                Editar
              </button>
              <button
                class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                @click="$emit('eliminar', cliente)"
              >
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
      <button v-if="mostrarBotones" @click="exportarExcel" class="bg-green-600 text-gray-100 hover:bg-green-800 font-bold py-2 px-4 rounded flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path d="M3 3a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V3zm2 0v14h10V3H5zm3 4h4v2H8V7zm0 4h4v2H8v-2z" />
        </svg>
        Exportar a Excel
      </button>
    </div>

    <!-- Pagination with improved design -->
    <div
      class="mt-6 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 sm:px-6"
    >
      <div class="flex flex-1 justify-between items-center">
        <div>
          <p class="text-sm text-gray-700 dark:text-gray-300">
            Mostrando página <span class="font-medium">{{ currentPage }}</span> de
            <span class="font-medium">{{ totalPages }}</span>
          </p>
        </div>
        <div class="flex gap-2">
          <button
            @click="$emit('cambiar-pagina', currentPage - 1)"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 shadow-sm"
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
            class="relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 shadow-sm"
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
import type { Cliente } from '../composables/useClients';
import { useAutenticacionStore } from '@/stores/use-autenticacion.store';
import { onMounted, ref, computed, watch } from 'vue';
import * as XLSX from 'xlsx';

const autenticacionStore = useAutenticacionStore();
const mostrarBotones = ref(false);
const filtroTipoEmpresa = ref('');
const searchTerm = ref('');

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
  tiposEmpresa: {
    type: Object as PropType<{ [key: number]: string }>,
    required: true,
  },
  clientes: {
    type: Array as PropType<Cliente[]>,
    required: true,
  },
});
defineEmits(['editar', 'eliminar', 'cambiar-pagina']);

const clientesFiltrados = computed(() => {
  let resultado = props.clientes;
  if (searchTerm.value) {
    resultado = resultado.filter(cliente =>
      cliente.Empresa.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      cliente.Ruc.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      cliente.Contacto.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      cliente.Correo.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      cliente.Teléfono.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
  }
  if (filtroTipoEmpresa.value) {
    resultado = resultado.filter(cliente => cliente['Tipo de empresa'] == Number(filtroTipoEmpresa.value));
  }
  return resultado.slice((props.currentPage - 1) * 10, props.currentPage * 10);
});

const resetSearchTerm = () => {
  searchTerm.value = '';
};

const resetFiltroTipoEmpresa = () => {
  filtroTipoEmpresa.value = '';
};

watch(filtroTipoEmpresa, resetSearchTerm);
watch(searchTerm, resetFiltroTipoEmpresa);

onMounted(() => {
  mostrarBotones.value = autenticacionStore.privilegio === 1;
});

// Computed property para las cabeceras visibles
const cabecerasVisibles = computed(() => {
  if (mostrarBotones.value) {
    return props.cabecerasTabla;
  } else {
    // Retorna todas las cabeceras excepto la última
    return props.cabecerasTabla.slice(0, -1); 
  }
});

const exportarExcel = () => {
  const datosParaExportar = props.clientes.filter(cliente => {
    if (filtroTipoEmpresa.value) {
      return cliente['Tipo de empresa'] == Number(filtroTipoEmpresa.value);
    }
    return true;
  }).map(cliente => {
    const { Empresa, Ruc, Contacto, Correo, Teléfono, 'Tipo de empresa': tipoEmpresa } = cliente;
    return {
      Empresa,
      Ruc,
      Contacto,
      Correo,
      Teléfono,
      'Tipo de empresa': tipoEmpresa === 1 ? 'Pública' : tipoEmpresa === 2 ? 'Privada' : tipoEmpresa
    };
  });

  const ws = XLSX.utils.json_to_sheet(datosParaExportar);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Clientes');
  XLSX.writeFile(wb, 'clientes.xlsx');
};
</script>
