<template>
  <Head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  </Head>
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
        <div :class="['stat-card', { 'bg-gray-800': isDarkMode, 'bg-white': !isDarkMode }]">
          <div class="icon-wrapper bg-blue-100">
            <i class="fas fa-users text-blue-600"></i>
          </div>
          <div class="stat-content">
            <h3 class="text-lg font-semibold">Clientes</h3>
            <p class="text-2xl font-bold text-blue-600">{{ totalClientes }}</p>
          </div>
        </div>
        <div :class="['stat-card', { 'bg-gray-800': isDarkMode, 'bg-white': !isDarkMode }]">
          <div class="icon-wrapper bg-green-100">
            <i class="fas fa-calendar-check text-green-600"></i>
          </div>
          <div class="stat-content">
            <h3 class="text-lg font-semibold">Consultas del Mes</h3>
            <p class="text-2xl font-bold text-green-600">45</p>
          </div>
        </div>
        <div :class="['stat-card', { 'bg-gray-800': isDarkMode, 'bg-white': !isDarkMode }]">
          <div class="icon-wrapper bg-purple-100">
            <i class="fas fa-chart-line text-purple-600"></i>
          </div>
          <div class="stat-content">
            <h3 class="text-lg font-semibold">Proyectos en Curso</h3>
            <p class="text-2xl font-bold text-purple-600">12</p>
          </div>
        </div>
      </div>
      <!-- Quick Actions -->
      <div class="mt-12">
        <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Acciones Rápidas
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button :class="['action-button', { 'dark-action-button': isDarkMode }]">
            <i class="fas fa-plus-circle mr-2"></i>
            Nueva Consulta
          </button>
          <button :class="['action-button', { 'dark-action-button': isDarkMode }]">
            <i class="fas fa-user-plus mr-2"></i>
            Agregar Cliente
          </button>
          <button :class="['action-button', { 'dark-action-button': isDarkMode }]">
            <i class="fas fa-calendar-alt mr-2"></i>
            Agendar Reunión
          </button>
          <button :class="['action-button', { 'dark-action-button': isDarkMode }]">
            <i class="fas fa-file-alt mr-2"></i>
            Generar Reporte
          </button>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from '@/modules/dashboard/layouts/DashboardLayout.vue';
import { useClients } from '../composables/useClients';
import { inject, ref } from 'vue';

const { totalClientes } = useClients();
const isDarkMode = inject('isDarkMode', ref(false));
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
