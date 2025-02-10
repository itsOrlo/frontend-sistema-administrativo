<template>
  <div>
    <h2 class="text-lg font-bold mb-4 text-gray-800 dark:text-white">Actividades del Trámite: {{ tramite }}</h2>
    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar..."
        class="px-4 py-2 border rounded-lg w-full dark:bg-gray-800 dark:text-gray-300"
      />
    </div>
    <div class="overflow-x-auto table-responsive">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 shadow-lg rounded-lg">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fecha de Despacho</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Estado</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Observación</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="actividad in paginatedActivities" :key="actividad.conrd_id" class="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
            <td class="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-300">{{ formatDate(actividad.conr_fecha_despacho) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-300">{{ actividad.conre_nombre }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-300">{{ actividad.conr_observacion }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="mt-6 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 sm:px-6">
      <div class="flex flex-1 justify-between items-center">
        <div>
          <p class="text-sm text-gray-700 dark:text-gray-300">
            Mostrando página <span class="font-medium">{{ currentPage }}</span> de
            <span class="font-medium">{{ totalPages }}</span>
          </p>
        </div>
        <div class="flex gap-2">
          <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
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

          <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
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
import { ref, computed, onMounted } from 'vue';
import { useActivities } from '../composables/useActivities';

const props = defineProps<{ tramite: string }>();
interface Actividad {
  conrd_id: number;
  conr_fecha_despacho: string;
  conre_nombre: string;
  conr_observacion: string;
}

const actividades = ref<Actividad[]>([]);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;

const { getActivitiesByTramite } = useActivities();

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const filteredActivities = computed(() => {
  if (!searchQuery.value) {
    return actividades.value;
  }
  return actividades.value.filter((actividad: any) =>
    Object.values(actividad).some((value: any) =>
      String(value).toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  );
});

const paginatedActivities = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredActivities.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredActivities.value.length / itemsPerPage);
});

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

onMounted(async () => {
  actividades.value = await getActivitiesByTramite(props.tramite);
});
</script>

<style scoped>
.table-responsive {
  max-height: 400px;
  overflow-y: auto;
}
</style>
