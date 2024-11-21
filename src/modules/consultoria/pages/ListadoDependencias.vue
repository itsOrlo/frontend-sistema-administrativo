<template>
  <DashboardLayout>
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-4">Dependencias</h2>

      <!-- Header Actions -->
      <div class="flex justify-between mb-4">
        <input
          type="text"
          v-model="searchTerm"
          placeholder="Buscar..."
          class="p-2 border rounded w-64"
        />
        <button
          @click="toggleCreateModal(true)"
          class="bg-blue-800 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
        >
          + Nueva Dependencia
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center py-8">
        <span class="text-gray-500">Cargando dependencia...</span>
      </div>

      <!-- Clients Table -->
      <DependenciasTable
        v-else
        :dependencias="dependenciasPaginados"
        :current-page="currentPage"
        :total-pages="totalPages"
        :cabecerasTabla="cabecerasTabla"
        @editar="editarDependencia" 
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
      :dependenciaAEditar="dependenciaSeleccionado"
      @cerrar-modal="toggleEditModal(false)"
      @dependencia-actualizado="loadDepends"
    />
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import DashboardLayout from '@/modules/dashboard/layouts/DashboardLayout.vue';
import type { Dependencia } from '../composables/useDependencias';
import DependenciasTable from '../components/DependenciasTable.vue';
import { useDependencia } from '../composables/useDependencias';
import CrearDependencia from '../components/CrearDependencia.vue';
import EditarDependencia from '../components/EditarDependencia.vue';

const {
  mostrarModalEditar,
  dependenciaSeleccionado,
  toggleEditModal,

  cabecerasTabla,
  // Estado
  dependencias,
  searchTerm,
  currentPage,
  isLoading,
  mostrarModalCrear,

  // Computed
  dependenciasPaginados,
  totalPages,

  // Métodos
  loadDepends,
  deleteDepend,
  setPage,
  toggleCreateModal,
} = useDependencia();

const editarDependencia = (dependencia: Dependencia) => {
  // Agrega la interfaz Cliente aquí
  dependenciaSeleccionado.value = dependencia;
  toggleEditModal(true, dependencia);
};

onMounted(loadDepends);
</script>
