<template>
  <Transition name="fade">
    <div v-if="mostrarModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="relative mx-4 w-full max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl" @click.stop>
        <header class="bg-blue-700 dark:bg-blue-900 px-6 py-4 rounded-t-lg">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-bold text-white">Detalles de Consultoría</h2>
            <button @click="handleClose" class="text-white hover:text-gray-200 focus:outline-none" aria-label="Cerrar modal">
              <i class="fas fa-times text-2xl"></i>
            </button>
          </div>
        </header>
        <div class="p-6">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <p class="text-black dark:text-white"><strong>Trámite:</strong> {{ consultoria.Trámite }}</p>
              <button @click="copyToClipboard(consultoria.Trámite)" class="bg-gray-500 text-white py-1 px-3 rounded hover:bg-gray-600 transition duration-200 flex items-center">
                <i class="fas fa-copy mr-1"></i> Copiar
              </button>
            </div>
            <p class="text-black dark:text-white"><strong>Dependencia:</strong> {{ consultoria.Dependencia }}</p>
            <p class="text-black dark:text-white"><strong>Empresa Cliente:</strong> {{ consultoria['Empresa cliente'] }}</p>
            <p class="text-black dark:text-white"><strong>Fecha de Registro:</strong> {{ consultoria['Fecha de registro'] }}</p>
            <p class="text-black dark:text-white"><strong>Asunto:</strong> {{ consultoria.Asunto }}</p>
            <p class="text-black dark:text-white"><strong>Estado:</strong> {{ consultoria.Estado }}</p>
          </div>
          <div class="flex justify-between mt-4">
            <button @click="copyAllDetails" class="bg-teal-500 text-white py-2 px-4 rounded hover:bg-teal-600 transition duration-200 flex items-center">
              <i class="fas fa-copy mr-1"></i> Copiar todos los detalles
            </button>
            <button @click="verActividades" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200 flex items-center">
              <i class="fas fa-tasks mr-1"></i> Ver Actividades
            </button>
          </div>
          <div class="mt-4 flex justify-center">
            <button @click="handleClose" class="bg-gray-300 dark:bg-gray-700 text-black dark:text-white py-2 px-4 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition duration-200 w-full">
              <i class="fas fa-times mr-1"></i> Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import { useRouter } from 'vue-router';

interface Props {
  mostrarModal: boolean;
  consultoria: any; // Cambia 'any' por el tipo adecuado si lo tienes definido
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'cerrar-modal': [];
  'ver-actividades': [string];
}>();

const router = useRouter();

const handleClose = () => {
  emit('cerrar-modal');
};

const verActividades = () => {
  router.push({ name: 'centroActividades', params: { tramite: props.consultoria.Trámite } });
};

// Configuración de Toastr
toastr.options = {
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
  const details = `
    Trámite: ${props.consultoria.Trámite}
    Dependencia: ${props.consultoria.Dependencia}
    Empresa Cliente: ${props.consultoria['Empresa cliente']}
    Fecha de Registro: ${props.consultoria['Fecha de registro']}
    Fecha de Despacho: ${props.consultoria['Fecha de despacho']}
    Asunto: ${props.consultoria.Asunto}
    Estado: ${props.consultoria.Estado}
    Observación: ${props.consultoria.Observacion}
  `;
  
  navigator.clipboard.writeText(details).then(() => {
    toastr.success('Detalles copiados al portapapeles');
  }).catch(err => {
    console.error('Error al copiar al portapapeles: ', err);
    toastr.error('Error al copiar al portapapeles');
  });
};
</script>

<style scoped>
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