<template>
  <DashboardLayout>
    <div class="centro-actividades-container">
      <div class="header">
        <h2 class="text-3xl font-bold text-gray-800 dark:text-white">Centro de Actividades</h2>
        <router-link to="/listarConsultorias" class="close-link">
          <i class="fas fa-times text-2xl"></i>
        </router-link>
      </div>
      <div class="content mt-8" v-if="consultoria">
        <div class="details">
          <div class="detail-item">
            <p class="text-black dark:text-white"><strong>Trámite:</strong> {{ consultoria['N° Trámite'] }}</p>
            <button @click="copyToClipboard(consultoria['N° Trámite'])" class="copy-button">
              <i class="fas fa-copy mr-1"></i> Copiar
            </button>
          </div>
          <p class="text-black dark:text-white"><strong>Dependencia:</strong> {{ consultoria.Dependencia }}</p>
          <p class="text-black dark:text-white"><strong>Empresa Cliente:</strong> {{ consultoria.Empresa }}</p>
          <p class="text-black dark:text-white"><strong>Asunto:</strong> {{ consultoria.Asunto }}</p>
          <p class="text-black dark:text-white"><strong>Estado:</strong> {{ consultoria.Estado }}</p>
        </div>
        <div class="actions mt-4">
          <button @click="copyAllDetails" class="copy-all-button">
            <i class="fas fa-copy mr-1"></i> Copiar todos los detalles
          </button>
        </div>
        <div class="activities-table mt-6">
          <ActividadesTable :tramite="consultoria['N° Trámite']" />
        </div>
      </div>
      <div v-else class="loading">
        <p class="text-gray-700 dark:text-gray-300">Cargando detalles de la consultoría...</p>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useConsultoria } from '../composables/useConsultoria';
import ActividadesTable from '../components/ActividadesTable.vue';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import DashboardLayout from '@/modules/dashboard/layouts/DashboardLayout.vue';

const route = useRoute();
interface Consultoria {
  'N° Trámite': string;
  Dependencia: string;
  Empresa: string;
  'Fecha de registro': string;
  'Fecha de despacho'?: string;
  Asunto: string;
  Estado: string;
  Observación?: string;
}

const consultoria = ref<Consultoria | null>(null);

const { loadConsultoriasPorTramite } = useConsultoria();

onMounted(async () => {
  const tramite = route.params.tramite as string;
  const response = await loadConsultoriasPorTramite(tramite);
  if (response && response.length > 0) {
    consultoria.value = response[0];
    console.log('Detalles de la consultoría:', consultoria.value);
  } else {
    console.error('No se encontraron detalles para el trámite especificado.');
  }
});

// Configuración de Toastr
toastr.options = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": true,
  "progressBar": true,
  "positionClass": "toast-top-right",
  "preventDuplicates": false,
  "onclick": undefined,
  "showDuration": 300,
  "hideDuration": 1000,
  "timeOut": 5000,
  "extendedTimeOut": 1000,
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
};

// Función para copiar texto al portapapeles
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    toastr.success('Trámite copiado al portapapeles');
  }).catch(err => {
    console.error('Error al copiar al portapapeles: ', err);
    toastr.error('Error al copiar al portapapeles');
  });
};

// Función para copiar todos los detalles
const copyAllDetails = () => {
  if (consultoria.value) {
    const details = `
      Trámite: ${consultoria.value['N° Trámite']}
      Dependencia: ${consultoria.value.Dependencia}
      Empresa Cliente: ${consultoria.value.Empresa}
      Fecha de Registro: ${consultoria.value['Fecha de registro']}
      Fecha de Despacho: ${consultoria.value['Fecha de despacho']}
      Asunto: ${consultoria.value.Asunto}
      Estado: ${consultoria.value.Estado}
      Observación: ${consultoria.value.Observación}
    `;
    
    navigator.clipboard.writeText(details).then(() => {
      toastr.success('Detalles copiados al portapapeles');
    }).catch(err => {
      console.error('Error al copiar al portapapeles: ', err);
      toastr.error('Error al copiar al portapapeles');
    });
  } else {
    toastr.error('No hay detalles de consultoría para copiar');
  }
};
</script>

<style scoped>
.centro-actividades-container {
  padding: 2rem;
  text-align: center;
}

.header {
  @apply flex justify-between items-center;
}

.close-link {
  @apply text-white hover:text-gray-200 focus:outline-none;
}

.content {
  @apply mt-8;
}

.details {
  @apply space-y-4;
}

.detail-item {
  @apply flex items-center justify-between;
}

.copy-button {
  @apply bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition duration-200 flex items-center;
}

.actions {
  @apply flex justify-between mt-4;
}

.copy-all-button {
  @apply bg-teal-500 text-white py-2 px-4 rounded hover:bg-teal-600 transition duration-200 flex items-center;
}

.activities-table {
  @apply mt-6;
}

.loading {
  @apply p-6;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Modo oscuro */
.dark .bg-white {
  background-color: #2d3748;
}

.dark .text-black {
  color: #e2e8f0;
}

.dark .bg-gray-300 {
  background-color: #4a5568;
}

.dark .hover\:bg-gray-400:hover {
  background-color: #718096;
}
</style>
