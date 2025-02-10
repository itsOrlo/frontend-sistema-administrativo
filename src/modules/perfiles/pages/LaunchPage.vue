<template>
  <DashboardLayout>
    <div class="p-8 bg-gray-50">
      <!-- Encabezado -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-semibold text-gray-800">Lanzamiento de proceso</h1>
          <p class="text-gray-500">Configura los detalles de la vacante que pretendes cubrir, es fácil y rápido</p>
        </div>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="irASummary" class="bg-white p-6 rounded-lg shadow-md">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <!-- Nombre del proceso -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2" for="nombreProceso">Nombre del proceso</label>
            <input 
              type="text" 
              id="nombreProceso" 
              class="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
              placeholder="DESARROLLADOR DE SOFTWARE 2024 07 16"
              v-model="nombreProceso"
              :class="{ 'border-red-500': errores.nombreProceso }"
            />
            <p v-if="errores.nombreProceso" class="text-red-500 text-sm mt-1">{{ errores.nombreProceso }}</p>
          </div>

          <!-- Fecha y hora de inicio -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2" for="fechaInicio">Fecha y hora de inicio</label>
            <input 
              type="datetime-local" 
              id="fechaInicio" 
              class="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
              v-model="fechaInicio"
              :class="{ 'border-red-500': errores.fechaInicio }"
            />
            <p v-if="errores.fechaInicio" class="text-red-500 text-sm mt-1">{{ errores.fechaInicio }}</p>
          </div>

          <!-- Fecha y hora de fin -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2" for="fechaFin">Fecha y hora de fin</label>
            <input 
              type="datetime-local" 
              id="fechaFin" 
              class="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
              v-model="fechaFin"
              :class="{ 'border-red-500': errores.fechaFin }"
            />
            <p v-if="errores.fechaFin" class="text-red-500 text-sm mt-1">{{ errores.fechaFin }}</p>
          </div>
        </div>

        <!-- Switches -->
        <div class="space-y-3 mb-6">
          <div class="flex items-center justify-between space-x-4">
            <label class="text-gray-700">Precalificación de video entrevistas con Copilot AI</label>
            <input type="checkbox" class="toggle" v-model="precalificacion" />
          </div>

          <div class="flex items-center justify-between space-x-4">
            <label class="text-gray-700">Activar evaluación automática de prueba Trust</label>
            <input type="checkbox" class="toggle" v-model="evaluacionAutomatica" />
          </div>

          <div class="flex items-center justify-between space-x-4">
            <label class="text-gray-700">Análisis del registro fotográfico con Copilot AI</label>
            <input type="checkbox" class="toggle" v-model="analisisFotografico" />
          </div>
        </div>

        <!-- Configuración avanzada -->
        <div class="mb-6">
          <button type="button" @click="toggleConfigAvanzada" class="text-blue-500 hover:underline focus:outline-none">
            Configuración avanzada
          </button>
        </div>

        <!-- Sección de Configuración Avanzada -->
        <transition name="fade">
          <div v-if="mostrarConfigAvanzada" class="space-y-3 mb-6">
            <!-- Tipo de ambiente -->
            <div class="flex items-center space-x-4">
              <span class="text-gray-700">Tipo de ambiente:</span>
              <label class="flex items-center space-x-1">
                <input type="radio" value="estandar" v-model="tipoAmbiente" />
                <span class="ml-1">ESTÁNDAR</span>
              </label>
              <label class="flex items-center space-x-1">
                <input type="radio" value="controlado" v-model="tipoAmbiente" />
                <span class="ml-1">CONTROLADO</span>
              </label>
            </div>

            <!-- Solicitar registro -->
            <div v-if="tipoAmbiente === 'controlado'" class="flex items-center justify-between space-x-4">
              <label class="text-gray-700">Solicitar registro (El evaluado debe registrar una cuenta)</label>
              <input type="checkbox" class="toggle" v-model="solicitarRegistro" @change="handleSolicitarRegistroChange" />
            </div>

            <!-- Notificación a otros reclutadores -->
            <div>
              <label class="text-gray-700">Notificar a otros reclutadores sobre el lanzamiento del proceso</label>
              <input 
                type="email" 
                placeholder="example@gmail.com" 
                class="w-full mt-2 border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                v-model="emailReclutadores"
              />
            </div>

            <!-- Nombre público de la empresa (bajo el correo) -->
            <div v-if="!mostrarDetallesEmpresa">
              <label class="block text-gray-700 mt-4">Nombre público de la empresa</label>
              <input 
                type="text" 
                placeholder="Nombre de la empresa" 
                class="w-full mt-2 border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                v-model="nombreEmpresa"
              />
            </div>

            <!-- Más switches -->
            <div class="space-y-3">
              <div class="flex items-center justify-between space-x-4">
                <label class="text-gray-700">Notificar candidatos finalizados</label>
                <input type="checkbox" class="toggle" v-model="notificarFinalizados" />
              </div>

              <div class="flex items-center justify-between space-x-4">
                <label class="text-gray-700">Proceso privado (interno)</label>
                <input type="checkbox" class="toggle" v-model="procesoPrivado" />
              </div>

              <!-- Mostrar detalles a la empresa -->
              <div v-if="tipoAmbiente === 'estandar' || solicitarRegistro" class="flex items-center justify-between space-x-4">
                <label class="text-gray-700">Mostrar detalles a la empresa</label>
                <input type="checkbox" class="toggle" v-model="mostrarDetallesEmpresa" @change="handleDetallesEmpresaChange" />
              </div>
            </div>
          </div>
        </transition>

        <!-- Botones alineados a la derecha -->
        <div class="flex justify-end mt-6">
          <button type="button" class="text-gray-500 hover:text-gray-800 mr-4">GUARDAR COMO BORRADOR</button>
          <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md">LANZAR PROCESO</button>
        </div>
      </form>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref } from 'vue';
import DashboardLayout from '@/modules/dashboard/layouts/DashboardLayout.vue';
import { useRouter } from 'vue-router';

// Datos principales del proceso
const nombreProceso = ref('');
const fechaInicio = ref('');
const fechaFin = ref('');
const precalificacion = ref(false);
const evaluacionAutomatica = ref(false);
const analisisFotografico = ref(false);

// Configuración avanzada
const mostrarConfigAvanzada = ref(false);
const tipoAmbiente = ref('estandar');
const solicitarRegistro = ref(false);
const emailReclutadores = ref('');
const notificarFinalizados = ref(false);
const procesoPrivado = ref(false);
const mostrarDetallesEmpresa = ref(true);
const nombreEmpresa = ref('');

// Errores de validación
const errores = ref({
  nombreProceso: '',
  fechaInicio: '',
  fechaFin: '',
});

// Función para alternar la sección de configuración avanzada
const toggleConfigAvanzada = () => {
  mostrarConfigAvanzada.value = !mostrarConfigAvanzada.value;
};

// Manejar el cambio en "Mostrar detalles a la empresa"
const handleDetallesEmpresaChange = () => {
  if (!mostrarDetallesEmpresa.value) {
    nombreEmpresa.value = '';
  }
};

// Manejar el cambio en "Solicitar registro"
const handleSolicitarRegistroChange = () => {
  if (!solicitarRegistro.value) {
    mostrarDetallesEmpresa.value = false;
    nombreEmpresa.value = '';
  } else {
    mostrarDetallesEmpresa.value = true;
  }
};

// Validaciones
// const validarFormulario = () => {
//   let valid = true;
//   errores.value = {
//     nombreProceso: '',
//     fechaInicio: '',
//     fechaFin: '',
//   };

//   if (!nombreProceso.value) {
//     errores.value.nombreProceso = 'El nombre del proceso es obligatorio';
//     valid = false;
//   }

//   if (!fechaInicio.value) {
//     errores.value.fechaInicio = 'La fecha de inicio es obligatoria';
//     valid = false;
//   }

//   if (!fechaFin.value) {
//     errores.value.fechaFin = 'La fecha de fin es obligatoria';
//     valid = false;
//   }

//   return valid;
// };

// Función para lanzar el proceso
// const lanzarProceso = () => {
//   if (validarFormulario()) {
//     alert('Proceso lanzado con éxito');
//   }
// };


const router = useRouter();  

const irASummary = () => {
  router.replace("/perfil-summary"); // Reemplaza la página actual con la nueva
};

</script>

<style scoped>
.toggle {
  @apply h-6 w-11 bg-gray-300 rounded-full cursor-pointer transition-colors duration-200 ease-in-out;
}

.toggle:checked {
  @apply bg-blue-500;
}
</style>
