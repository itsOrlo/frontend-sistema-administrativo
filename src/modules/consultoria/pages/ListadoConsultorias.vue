<template>
  <DashboardLayout>
    <div class="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
        <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">Gestión de Consultorías</h2>
        <p class="text-gray-600 dark:text-gray-300">Administra tus consultorías y clientes</p>
      </div>

      <div class="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div class="relative">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center">
            <svg class="h-5 w-5 text-gray-400 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input type="text" v-model="searchTerm" placeholder="Buscar consultorías..."
            class="pl-10 pr-4 py-3 w-full md:w-80 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
        <button v-if="mostrarBotones" @click="toggleCreateModal(true)"
          class="bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2 shadow-md">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nueva Consultoria
        </button>
      </div>

      <div v-if="isLoading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <ConsultoriaTable :consultorias="consultoriasFiltradas" :current-page="currentPage" :total-pages="totalPages"
          :cabecerasTabla="cabecerasTabla" @editar="editarConsultoria" @eliminar="deleteConsultoria"
          @cambiar-pagina="setPage" class="w-full" />
      </div>
    </div>

    <CrearConsultoria :mostrar-modal="mostrarModalCrear" :dependencias="dependenciasFormateadas"
      :clientes="clientesFormateados" @cerrar-modal="toggleCreateModal(false)"
      @consultoria-creada="handleConsultoriaCreada" />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { useConsultoria } from '../composables/useConsultoria';
import { useClients } from '../composables/useClients';
import { useDependencia } from '../composables/useDependencias';
import DashboardLayout from '@/modules/dashboard/layouts/DashboardLayout.vue';
import ConsultoriaTable from '../components/ConsultoriaTable.vue';
import CrearConsultoria from '../components/CrearConsultoria.vue';
import type { Consultoria } from '../composables/useConsultoria';
import { useAutenticacionStore } from '@/stores/use-autenticacion.store';
import { onMounted, ref, computed } from 'vue';

const autenticacionStore = useAutenticacionStore();
const mostrarBotones = ref(false);
const filtroEstadoConsultoria = ref('');

const {
  consultoriaSeleccionada,
  toggleEditModal,
  cabecerasTabla,
  searchTerm,
  currentPage,
  isLoading,
  mostrarModalCrear,
  consultoriasPaginadas,
  totalPages,
  loadConsultorias,
  deleteConsultoria,
  setPage,
  toggleCreateModal,
} = useConsultoria();

const {
  clientes,
  loadClients,
} = useClients();

const {
  dependenciasFormateadas,
  loadDepends,
} = useDependencia();

const clientesFormateados = computed(() => {
  return clientes.value.reduce((acc, cliente) => {
    acc[cliente.Acción] = cliente.Empresa;
    return acc;
  }, {} as Record<number, string>);
});

const editarConsultoria = (consultoria: Consultoria) => {
  consultoriaSeleccionada.value = consultoria;
  toggleEditModal(true, consultoria);
};

const handleConsultoriaCreada = async () => {
  await Promise.all([
    loadConsultorias(),
    loadClients(),
    loadDepends()
  ]);
};

const consultoriasFiltradas = computed(() => {
  return consultoriasPaginadas.value.filter(consultoria => {
    const matchesSearchTerm = consultoria.Trámite.toLowerCase().includes(searchTerm.value.toLowerCase());
    const matchesEstado = filtroEstadoConsultoria.value === '' || consultoria.Estado === filtroEstadoConsultoria.value;
    return matchesSearchTerm && matchesEstado;
  });
});

onMounted(async () => {
  mostrarBotones.value = autenticacionStore.privilegio === 1;
  await Promise.all([
    loadConsultorias(),
    loadClients(),
    loadDepends()
  ]);
});
</script>
