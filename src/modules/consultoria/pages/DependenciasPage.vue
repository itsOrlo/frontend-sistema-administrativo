<template>
  <DashboardLayout>
    <div class="p-6 dark:bg-gray-800">
      <h2 class="text-2xl font-bold mb-4 dark:text-white">Dependencias</h2>

      <!-- Header Actions -->
      <div class="flex justify-between mb-4">
        <input
          type="text"
          v-model="searchTerm"
          placeholder="Buscar..."
          class="p-2 border rounded w-64 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
        <button
          v-if="mostrarBotones"
          @click="toggleCreateModal(true)"
          class="bg-blue-800 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
        >
          + Nueva Dependencia
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center py-8">
        <span class="text-gray-500 dark:text-gray-400">Cargando dependencia...</span>
      </div>

      <!-- Clients Table -->
      <DependenciasTable
        v-else
        :dependencias="dependenciasPaginados"
        :current-page="currentPage"
        :total-pages="totalPages"
        :cabeceras-tabla="cabecerasTabla"
        @editar="editarDependencia" 
        @eliminar="eliminarDependencia"
        @cambiar-pagina="setPage"
      />

      <!-- Create Modal -->
      <CrearDependencia
        v-if="mostrarModalCrear"
        :mostrarModal="mostrarModalCrear"
        :clienteARegistrar="dependenciaSeleccionado"
        @cerrar-modal="toggleCreateModal(false)"
        @dependencia-creada="loadDepends"
      />

      <EditarDependencia
      v-if="mostrarModalEditar"
      :mostrarModal="mostrarModalEditar"
      :dependenciaAEditar="dependenciaSeleccionado!"
      @cerrar-modal="toggleEditModal(false)"
      @dependencia-actualizado="loadDepends"
    />
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from '@/modules/dashboard/layouts/DashboardLayout.vue';
import type { Dependencia } from '../composables/useDependencias';
import DependenciasTable from '../components/DependenciasTable.vue';
import { useDependencia, deleteDepend } from '../composables/useDependencias'; // Importar deleteDepend
import CrearDependencia from '../components/CrearDependencia.vue';
import EditarDependencia from '../components/EditarDependencia.vue';
import { useAutenticacionStore } from '@/stores/use-autenticacion.store';
import { onMounted, ref } from 'vue';

const autenticacionStore = useAutenticacionStore();
const mostrarBotones = ref(false);

// Computed property para determinar si se deben mostrar los botones
onMounted(() => {
  console.log('privilegio:', autenticacionStore.privilegio);
  mostrarBotones.value = autenticacionStore.privilegio === 1;
});

const {
  dependencias, // Asegurarse de que dependencias esté definido
  mostrarModalEditar,
  dependenciaSeleccionado,
  toggleEditModal,

  cabecerasTabla,
  // Estado
  searchTerm,
  currentPage,
  isLoading,
  mostrarModalCrear,

  // Computed
  dependenciasPaginados,
  totalPages,

  // Métodos
  loadDepends,
  setPage,
  toggleCreateModal,
} = useDependencia();

const editarDependencia = (dependencia: Dependencia) => {
  // Agrega la interfaz Cliente aquí
  dependenciaSeleccionado.value = dependencia;
  toggleEditModal(true, dependencia);
};

const eliminarDependencia = async (dependencia: Dependencia) => {
  await deleteDepend(dependencia, dependencias, loadDepends);
};

onMounted(loadDepends);
</script>
