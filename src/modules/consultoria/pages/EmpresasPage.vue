<template>
  <DashboardLayout>
    <div class="p-6">
      <h2 class="text-2xl text-gray-700 dark:text-gray-300 font-bold mb-4">Clientes</h2>

      <!-- Contadores de Tipo de Empresa -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div class="stat-card bg-purple-500 text-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold">Empresas Públicas</h3>
            <p class="text-3xl font-bold">{{ totalPublicas }}</p>
          </div>
          <i class="fas fa-building text-4xl"></i>
        </div>
        <div class="stat-card bg-pink-500 text-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold">Empresas Privadas</h3>
            <p class="text-3xl font-bold">{{ totalPrivadas }}</p>
          </div>
          <i class="fas fa-building text-4xl"></i>
        </div>
      </div>

      <!-- Header Actions -->
      <div class="flex justify-between mb-4">
        <input
          type="text"
          v-model="searchTerm"
          placeholder="Buscar..."
          class="p-2 border rounded w-64"
        />
        <button
        v-if="mostrarBotones"
          @click="toggleCreateModal(true)"
          class="bg-blue-800 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
        >
          + Nuevo Cliente
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center py-8">
        <span class="text-gray-500">Cargando clientes...</span>
      </div>

      <!-- Clients Table -->
      <ClienteTable
        v-else
        :clientes="clientesFiltrados"
        :current-page="currentPage"
        :tiposEmpresa="tiposEmpresa"
        :total-pages="totalPages"
        :cabecerasTabla="cabecerasTabla"
        @editar="editarCliente" 
        @eliminar="deleteClient"
        @cambiar-pagina="setPage"
      />
    </div>

    <!-- Create Modal -->
    <CrearCliente
      v-if="mostrarModalCrear"
      :mostrarModal="mostrarModalCrear"
      :clienteARegistrar="clienteSeleccionado"
      :tiposEmpresa="tiposEmpresa"
      @cerrar-modal="toggleCreateModal(false)"
      @cliente-creado="loadClients"
    />

    <EditarCliente
      v-if="mostrarModalEditar"
      :mostrarModal="mostrarModalEditar"
      :clienteAEditar="clienteSeleccionado!"
      :tiposEmpresa="tiposEmpresa"
      @cerrar-modal="toggleEditModal(false)"
      @cliente-actualizado="loadClients"
    />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { useClients } from '../composables/useClients';
import DashboardLayout from '@/modules/dashboard/layouts/DashboardLayout.vue';
import ClienteTable from '../components/ClienteTable.vue';
import CrearCliente from '../components/CrearCliente.vue';
import EditarCliente from '../components/EditarCliente.vue';
import type { Cliente } from '../composables/useClients'; 
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
  mostrarModalEditar,
  clienteSeleccionado,
  toggleEditModal,

  tiposEmpresa,
  cabecerasTabla,
  // Estado
  searchTerm,
  currentPage,
  isLoading,
  mostrarModalCrear,

  // Computed
  clientesFiltrados,
  totalPages,

  // Métodos
  loadClients,
  deleteClient,
  setPage,
  toggleCreateModal,

  // Contadores de tipo de empresa
  totalPublicas,
  totalPrivadas,
} = useClients();

const editarCliente = (cliente: Cliente) => { 
  clienteSeleccionado.value = cliente; 
  toggleEditModal(true, cliente); 
};

onMounted(loadClients);
</script>
