<template>
  <div>
    <!-- Dropdown para filtrar por estado -->
    <div class="mb-4">
      <label for="estado-filter" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Filtrar por
        estado:</label>
      <select id="estado-filter" v-model="filtroEstadoConsultoria"
        class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-md">
        <option value="">Todos</option>
        <option v-for="estado in estadosConsultoria" :key="estado.conre_id" :value="estado.conre_nombre">
          {{ estado.conre_nombre }}
        </option>
      </select>
    </div>

    <!-- Start Table -->
    <div class="overflow-x-auto table-responsive">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 shadow-lg rounded-lg">
        <thead class="bg-gray-50 dark:bg-gray-800 ">
          <tr>
            <!-- Asignado dinámico de cabecera -->
            <th v-for="(cabecera, index) in cabecerasFiltradas" :key="index" scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ cabecera }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="consultoria in consultoriasFiltradas" :key="consultoria.conr_id"
            class="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
            <td class="px-6 py-4 whitespace-nowrap">
              <div @click="mostrarDetalles(consultoria)"
                class="text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer hover:text-blue-600">
                {{ formatEmptyColumn(consultoria.Trámite, 10) }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 dark:text-gray-300">
                {{ formatEmptyColumn(consultoria.Dependencia, 10) }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 dark:text-gray-300">
                {{ formatEmptyColumn(consultoria['Empresa cliente'], 10) }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ formatEmptyColumn2(consultoria['Fecha de registro'], 10) }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500 dark:text-gray-400">{{ formatEmptyColumn(consultoria.Asunto, 10) }}
              </div>
            </td>

            <td v-if="mostrarBotones" class="px-6 py-5">
              <a v-if="consultoria.conr_adjunto" :href="consultoria.conr_adjunto" download
                class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-1 px-7 rounded flex items-center justify-center shadow-md">
                <i class="fa fa-download mr-1"></i>
                Descargar
              </a>
              <span v-else class="text-gray-500 dark:text-gray-400">No disponible</span>
            </td>

            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              <div :class="{
                'bg-yellow-400 text-gray-100': consultoria.Estado === 'En marcha',
                'bg-green-400 text-gray-100': consultoria.Estado === 'Finalizado',
                'bg-red-500 text-gray-100': consultoria.Estado === 'No es factible',
                'bg-gray-500 text-gray-100': consultoria.Estado === 'Por despachar',
              }" class="inline-block px-3 py-1 rounded-full font-semibold">
                {{ consultoria.Estado }}
              </div>
            </td>
            <td v-if="mostrarBotones" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              <div class="relative">
                <button :id="`dropdown-button-${consultoria.conr_id}`" @click="toggleDropdown(consultoria.conr_id)"
                  class="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded flex items-center shadow-md">
                  Acción
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                <ul :id="`dropdown-menu-${consultoria.conr_id}`" v-if="dropdownStates[consultoria.conr_id]"
                  class="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full shadow-lg">
                  <li v-if="consultoria.Estado !== 'Finalizado' && consultoria.Estado !== 'No es factible'"
                    @click="handleActionChange('editar', consultoria)"
                    class="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
                    <i class="fa fa-pencil-alt mr-2"></i>
                    Editar
                  </li>
                  <li @click="handleActionChange('detalles', consultoria)"
                    class="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
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
    <div class="mt-4 flex justify-end gap-2">
      <button @click="exportarTodasConsultorias"
        class="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded flex items-center shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path
            d="M3 3a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V3zm2 0v14h10V3H5zm3 4h4v2H8V7zm0 4h4v2H8v-2z" />
        </svg>
        Exportar BD
      </button>
      <button @click="exportarExcel"
        class="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded flex items-center shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path
            d="M3 3a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V3zm2 0v14h10V3H5zm3 4h4v2H8V7zm0 4h4v2H8v-2z" />
        </svg>
        Exportar Vista Actual
      </button>
    </div>

    <!-- Pagination with improved design -->
    <div
      class="mt-6 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 sm:px-6 shadow-md rounded-lg">
      <div class="flex flex-1 justify-between items-center">
        <div>
          <p class="text-sm text-gray-700 dark:text-gray-300">
            Mostrando página <span class="font-medium">{{ currentPage }}</span> de
            <span class="font-medium">{{ totalPages }}</span>
          </p>
        </div>
        <div class="flex gap-2">
          <button @click="$emit('cambiar-pagina', currentPage - 1)" :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 shadow-sm"
            :class="{
              'hover:bg-gray-50 focus:z-20 focus:outline-offset-0': currentPage !== 1,
              'opacity-50 cursor-not-allowed': currentPage === 1,
            }">
            <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Anterior
          </button>

          <button @click="$emit('cambiar-pagina', currentPage + 1)" :disabled="currentPage === totalPages"
            class="relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 shadow-sm"
            :class="{
              'hover:bg-gray-50 focus:z-20 focus:outline-offset-0': currentPage !== totalPages,
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

    <DetallesConsultoria v-if="mostrarModalDetalles" :mostrarModal="mostrarModalDetalles"
      :consultoria="consultoriaSeleccionada" @cerrar-modal="cerrarModalDetalles" />
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { Consultoria } from '../composables/useConsultoria';
import { useConsultoria } from '../composables/useConsultoria';
import { useAutenticacionStore } from '@/stores/use-autenticacion.store';
import { onMounted, ref, computed, onBeforeUnmount } from 'vue';
import * as XLSX from 'xlsx';
import DetallesConsultoria from './DetallesConsultoria.vue';

const autenticacionStore = useAutenticacionStore();
const mostrarBotones = ref(false);
const mostrarModalDetalles = ref(false);
const consultoriaSeleccionada = ref<Consultoria | null>(null);

const { exportarTodasConsultorias, filtroEstadoConsultoria, estadosConsultoria, startDate, endDate } = useConsultoria();

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
const emit = defineEmits(['editar', 'eliminar', 'cambiar-pagina']);

const consultoriasFiltradas = computed(() => {
  return props.consultorias.filter(consultoria => {
    const matchesEstado = filtroEstadoConsultoria.value === '' || consultoria.Estado === filtroEstadoConsultoria.value;
    const matchesDate = (!startDate.value || new Date(consultoria['Fecha de registro']) >= new Date(startDate.value)) &&
                        (!endDate.value || new Date(consultoria['Fecha de registro']) <= new Date(endDate.value));
    return matchesEstado && matchesDate;
  });
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
  const cabecerasExcluidas = ['Fecha de despacho', 'Observación'];
  return props.cabecerasTabla.filter((cabecera, index) => {
    if (autenticacionStore.privilegio === 0 && ( index == 9)) {
      return false;
    }
    return !cabecerasExcluidas.includes(cabecera);
  });
});

const cabecerasFiltradas = computed(() => {
  return cabecerasVisibles.value.filter((cabecera, index) => {
    return !(mostrarBotones.value === false && (index === 5 || index === 7));
  });
});

const exportarExcel = () => {
  const datosParaExportar = props.consultorias.map((consultoria) => {
    const {
      Trámite,
      Dependencia,
      'Empresa cliente': EmpresaCliente,
      'Fecha de registro': FechaRegistro,
      Asunto,
      conr_adjunto,
      Estado,
    } = consultoria;
    return {
      Trámite: Trámite,
      Dependencia: Dependencia,
      'Empresa cliente': EmpresaCliente,
      'Fecha de registro': FechaRegistro,
      Asunto: Asunto,
      Archivo: conr_adjunto ? 'Disponible' : 'No disponible',
      Estado: Estado,
    };
  });

  const ws = XLSX.utils.json_to_sheet(datosParaExportar);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Consultorias');
  XLSX.writeFile(wb, 'consultorias_segmentado.xlsx');
};

const mostrarDetalles = (consultoria: Consultoria) => {
  consultoriaSeleccionada.value = consultoria;
  mostrarModalDetalles.value = true;
};

const cerrarModalDetalles = () => {
  mostrarModalDetalles.value = false;
  consultoriaSeleccionada.value = null;
};

const dropdownStates = ref<Record<number, boolean>>({}); // Objeto para manejar el estado de cada fila

const toggleDropdown = (id: number) => {
  dropdownStates.value[id] = !dropdownStates.value[id]; // Cambia el estado del dropdown de la fila seleccionada
};

// Función para cerrar el dropdown si se hace clic fuera de él
const closeDropdowns = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
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

const handleActionChange = (action: 'editar' | 'eliminar' | 'detalles', consultoria: Consultoria) => {
  if (action === 'editar') {
    emit('editar', consultoria.Trámite); // Emitir solo el valor 'Trámite'
  } else if (action === 'eliminar') {
    emit('eliminar', consultoria);
  } else if (action === 'detalles') {
    mostrarDetalles(consultoria);
  }
  dropdownStates.value[consultoria.conr_id] = false; // Cierra el dropdown después de seleccionar
};


const formatEmptyColumn = (texto: string, maxLength: number) => {
  if (!texto) return 'N/A';
  return texto.length > maxLength ? texto.substring(0, maxLength) + '...' : texto;
};
const formatEmptyColumn2 = (texto: string, maxLength: number) => {
  if (!texto) return 'N/A';
  return texto.length > maxLength ? texto.substring(0, maxLength) + '' : texto;
};
</script>
