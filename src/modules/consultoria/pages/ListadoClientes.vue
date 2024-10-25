<template>
  <DashboardLayout>
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-4">Clientes</h2>
      
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
        :clientes="clientesPaginados"
        :current-page="currentPage"
        :total-pages="totalPages"
        @editar="editarCliente"
        @eliminar="deleteClient"
        @cambiar-pagina="setPage"
      />
    </div>

    <!-- Create Modal -->
    <CrearCliente 
      v-if="mostrarModalCrear" 
      @cerrar-modal="toggleCreateModal(false)"
      @cliente-creado="loadClients"
    />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useClients } from '../composables/useClients'
import DashboardLayout from '@/modules/dashboard/layouts/DashboardLayout.vue'
import ClienteTable from '../components/ClienteTable.vue'
import CrearCliente from '../components/CrearCliente.vue'

const {
  // Estado
  searchTerm,
  currentPage,
  isLoading,
  mostrarModalCrear,
  
  // Computed
  clientesPaginados,
  totalPages,
  
  // Métodos
  loadClients,
  deleteClient,
  setPage,
  toggleCreateModal
} = useClients()

const editarCliente = (id: string) => {
  console.log('Editar cliente con ID:', id)
  // Implementar lógica de edición
}

onMounted(loadClients)
</script>