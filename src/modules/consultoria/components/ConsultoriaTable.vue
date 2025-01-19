<template>
  <div>
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
          <tr v-for="consultoria in consultoriasFiltradas" :key="consultoria.conr_id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 dark:text-gray-300">{{ consultoria.Trámite }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 dark:text-gray-300">
                {{ consultoria.Dependencia }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 dark:text-gray-300">
                {{ consultoria['Empresa cliente'] }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ consultoria['Fecha de registro'] }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ consultoria['Fecha de despacho'] }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500 dark:text-gray-400">{{ consultoria.Asunto }}</div>
            </td>

            <td class="px-6 py-4 whitespace-nowrap">
              <a
                v-if="consultoria.conr_adjunto"
                :href="consultoria.conr_adjunto"
                target="_blank"
                class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M10 0a2 2 0 00-2 2v8.586l-3.293-3.293A2 2 0 002 8.586l6 6a2 2 0 002 0l6-6a2 2 0 00-1.414-3.414L12 10.586V2a2 2 0 00-2-2z"
                  />
                </svg>
                Descargar
              </a>
              <span v-else class="text-gray-500 dark:text-gray-400">No disponible</span>
            </td>

            <td
              v-if="mostrarBotones"
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
            >
              <div
                :class="{
                  'bg-yellow-200 text-yellow-800': consultoria.Estado === 'En marcha',
                  'bg-green-200 text-green-800': consultoria.Estado === 'Finalizado',
                  'bg-red-200 text-red-800': consultoria.Estado === 'No es factible',
                  'bg-gray-200 text-gray-800': consultoria.Estado === 'Por despachar',
                }"
                class="inline-block px-3 py-1 rounded-full font-semibold"
              >
                {{ consultoria.Estado }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ consultoria.Observacion }}
              </div>
            </td>
            <td
              v-if="mostrarBotones"
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
            >
              <div class="relative">
                <button
                  :id="`dropdown-button-${consultoria.conr_id}`"
                  @click="toggleDropdown(consultoria.conr_id)"
                  class="bg-white border border-gray-300 rounded-md p-2 flex items-center"
                >
                  Seleccionar acción
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 9l6 6 6-6"
                    />
                  </svg>
                </button>
                <ul
                  :id="`dropdown-menu-${consultoria.conr_id}`"
                  v-if="dropdownStates[consultoria.conr_id]"
                  class="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full"
                >
                  <li
                    @click="handleActionChange('editar', consultoria)"
                    class="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <i class="fa fa-pencil-alt mr-2"></i>
                    Editar
                  </li>
                  <li
                    @click="handleActionChange('eliminar', consultoria)"
                    class="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <i class="fa fa-trash mr-2"></i>
                    Eliminar
                  </li>
                  <li
                    @click="handleActionChange('detalles', consultoria)"
                    class="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <i class="fa fa-file-alt mr-2"></i>
                    Detalles
                  </li>
                </ul>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- End Table -->

    <!-- Botón para exportar a Excel -->
    <div class="mt-4 flex justify-end">
      <button
        @click="exportarExcel"
        class="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M3 3a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V3zm2 0v14h10V3H5zm3 4h4v2H8V7zm0 4h4v2H8v-2z"
          />
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

    <DetallesConsultoria
      v-if="mostrarModalDetalles"
      :mostrarModal="mostrarModalDetalles"
      :consultoria="consultoriaSeleccionada"
      @cerrar-modal="cerrarModalDetalles"
    />
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { Consultoria } from '../composables/useConsultoria';
import { useAutenticacionStore } from '@/stores/use-autenticacion.store';
import { onMounted, ref, computed, onBeforeUnmount } from 'vue';
import * as XLSX from 'xlsx';
import DetallesConsultoria from './DetallesConsultoria.vue';

const autenticacionStore = useAutenticacionStore();
const mostrarBotones = ref(false);
const mostrarModalDetalles = ref(false);
const consultoriaSeleccionada = ref(null);

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
  consultorias: {
    type: Array as PropType<Consultoria[]>,
    required: true,
  },
});
defineEmits(['editar', 'eliminar', 'cambiar-pagina']);

const consultoriasFiltradas = computed(() => {
  return props.consultorias; // Asegúrate de que esto devuelva todos los registros en orden ascendente
});

const consultoriasPaginadas = computed(() => {
  const startIndex = (props.currentPage - 1) * 10;
  return consultoriasFiltradas.value.slice(startIndex, startIndex + 10);
});

onMounted(() => {
  mostrarBotones.value = autenticacionStore.privilegio === 1;
  document.addEventListener('click', closeDropdowns);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', closeDropdowns);
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
  const datosParaExportar = props.consultorias.map((consultoria) => {
    const {
      Trámite,
      Dependencia,
      'Empresa cliente': EmpresaCliente,
      'Fecha de registro': FechaRegistro,
      'Fecha de despacho': FechaDespacho,
      Asunto,
      conr_adjunto,
      Estado,
    } = consultoria;
    return {
      Trámite: Trámite,
      Dependencia: Dependencia,
      'Empresa cliente': EmpresaCliente,
      'Fecha de registro': FechaRegistro,
      'Fecha de despacho': FechaDespacho,
      Asunto: Asunto,
      Archivo: conr_adjunto ? 'Disponible' : 'No disponible',
      Estado: Estado,
    };
  });

  const ws = XLSX.utils.json_to_sheet(datosParaExportar);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Consultorias');
  XLSX.writeFile(wb, 'consultorias.xlsx');
};

const mostrarDetalles = (consultoria) => {
  consultoriaSeleccionada.value = consultoria;
  mostrarModalDetalles.value = true;
};

const cerrarModalDetalles = () => {
  mostrarModalDetalles.value = false;
  consultoriaSeleccionada.value = null;
};

const dropdownStates = ref({}); // Objeto para manejar el estado de cada fila

const toggleDropdown = (id) => {
  // Cierra todos los dropdowns y abre solo el que se selecciona
  for (const key in dropdownStates.value) {
    dropdownStates.value[key] = false;
  }
  dropdownStates.value[id] = !dropdownStates.value[id]; // Cambia el estado del dropdown de la fila seleccionada
};

// Función para cerrar el dropdown si se hace clic fuera de él
const closeDropdowns = (event) => {
  const target = event.target;
  for (const key in dropdownStates.value) {
    const dropdownButton = document.getElementById(`dropdown-button-${key}`);
    const dropdownMenu = document.getElementById(`dropdown-menu-${key}`);
    if (dropdownButton && dropdownMenu) {
      if (!dropdownButton.contains(target) && !dropdownMenu.contains(target)) {
        dropdownStates.value[key] = false; // Cierra el dropdown
      }
    }
  }
};

const handleActionChange = (action, consultoria) => {
  if (action === 'editar') {
    $emit('editar', consultoria);
  } else if (action === 'eliminar') {
    $emit('eliminar', consultoria);
  } else if (action === 'detalles') {
    mostrarDetalles(consultoria);
  }
  dropdownStates.value[consultoria.conr_id] = false; // Cierra el dropdown después de seleccionar
};
</script>
