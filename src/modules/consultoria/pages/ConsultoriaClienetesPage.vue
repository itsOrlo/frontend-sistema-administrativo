<template>
  <DashboardLayout>
    <div :class="['consultoria-container', { dark: isDarkMode }]">
      <!-- Header Section -->
      <div :class="['welcome-header', { dark: isDarkMode }]">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-white">
          Bienvenido al Panel de Consultoría
        </h1>
        <p class="text-gray-600 dark:text-gray-300 mt-2">
          Gestione sus consultas y clientes de manera eficiente
        </p>
      </div>
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div :class="['stat-card', { 'bg-gray-800': isDarkMode, 'bg-gradient-to-r from-blue-400 to-blue-600': !isDarkMode }]">
          <div class="icon-wrapper bg-blue-100">
            <i class="fas fa-users text-blue-600"></i>
          </div>
          <div class="stat-content">
            <h3 class="text-lg font-semibold text-white">Clientes</h3>
            <p class="text-2xl font-bold text-white">{{ totalClientes }}</p>
          </div>
        </div>
        <div :class="['stat-card', { 'bg-gray-800': isDarkMode, 'bg-gradient-to-r from-green-300 to-green-400': !isDarkMode }]">
          <div class="icon-wrapper bg-green-100">
            <i class="fas fa-calendar-check text-green-600"></i>
          </div>
          <div class="stat-content">
            <h3 class="text-lg font-semibold text-white">Consultas del Mes</h3>
            <p class="text-2xl font-bold text-white">45</p>
          </div>
        </div>
        <div :class="['stat-card', { 'bg-gray-800': isDarkMode, 'bg-gradient-to-r from-purple-400 to-purple-500': !isDarkMode }]">
          <div class="icon-wrapper bg-purple-100">
            <i class="fas fa-chart-line text-purple-600"></i>
          </div>
          <div class="stat-content">
            <h3 class="text-lg font-semibold text-white">Proyectos en Curso</h3>
            <p class="text-2xl font-bold text-white">12</p>
          </div>
        </div>
      </div>
      <!-- Quick Actions -->
      <div class="mt-12">
        <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Acciones Rápidas
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button @click="toggleCreateModal(true)" :class="['action-button', { 'dark-action-button': isDarkMode, 'bg-blue-500': !isDarkMode }]">
            <i class="fas fa-plus-circle mr-2"></i>
            Agregar Cliente
          </button>
          <button :class="['action-button', { 'dark-action-button': isDarkMode, 'bg-green-500': !isDarkMode }]">
            <i class="fas fa-user-plus mr-2"></i>
            Nueva Consulta
          </button>
          <button :class="['action-button', { 'dark-action-button': isDarkMode, 'bg-yellow-500': !isDarkMode }]">
            <i class="fas fa-calendar-alt mr-2"></i>
            Agendar Reunión
          </button>
          <button :class="['action-button', { 'dark-action-button': isDarkMode, 'bg-purple-500': !isDarkMode }]">
            <i class="fas fa-file-alt mr-2"></i>
            Generar Reporte
          </button>
        </div>
      </div>
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
  </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from '@/modules/dashboard/layouts/DashboardLayout.vue';
import { useClients } from '../composables/useClients';
import { inject, ref, onMounted } from 'vue';
import CrearCliente from '../components/CrearCliente.vue';

const { totalClientes, tiposEmpresa, loadClients } = useClients();
const isDarkMode = inject('isDarkMode', ref(false));
const mostrarModalCrear = ref(false);
const clienteSeleccionado = ref(null);

const toggleCreateModal = (state: boolean) => {
  mostrarModalCrear.value = state;
};

onMounted(loadClients);
</script>

<style scoped lang="postcss">
.consultoria-container {
  padding: 2rem;
}

.welcome-header {
  @apply p-6 rounded-lg shadow-sm border bg-white;
}

.stat-card {
  @apply p-6 rounded-lg shadow-md flex items-center space-x-4 bg-white;
}

.icon-wrapper {
  @apply p-4 rounded-full;
}

.action-button {
  @apply bg-white text-gray-800 hover:bg-gray-50 font-semibold py-3 px-4 rounded-lg 
         shadow-sm border w-full flex items-center justify-center 
         transition-colors duration-200;
}

/* Modo oscuro */
.dark .welcome-header {
  @apply bg-gray-800 border-gray-700 text-white;
}

.dark .stat-card {
  @apply bg-gray-800 border-gray-700 text-white;
}

.dark .action-button {
  @apply bg-gray-800 text-white border-gray-700 hover:bg-gray-700;
}

.dark .stat-content h3 {
  @apply text-white;
}

.dark .stat-content p {
  @apply text-white;
}

.title-text {
  @apply text-gray-800;
}

/* Modo oscuro */
:global(.dark) .title-text {
  @apply text-white;
}
</style>
