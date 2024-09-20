<template>
  <DashboardLayout>
    <!-- Información del proceso -->
    <div class="bg-white p-6 rounded-lg shadow-lg mb-6">
      <h1 class="text-2xl font-semibold text-gray-800 mb-4">Información del proceso</h1>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <p class="text-gray-600 font-semibold">Nombre:</p>
          <p class="text-gray-800">DESARROLLADOR DE SOFTWARE</p>
        </div>
        <div>
          <p class="text-gray-600 font-semibold">Perfil:</p>
          <p class="text-gray-800">DESARROLLADOR DE SOFTWARE</p>
        </div>
        <div>
          <p class="text-gray-600 font-semibold">Feedback a evaluados:</p>
          <p class="text-gray-800">No</p>
        </div>
      </div>
    </div>

    <!-- Secciones de Número de Candidatos y Consumo del plan -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Número de candidatos -->
      <div class="bg-white p-6 rounded-lg shadow-lg flex items-center justify-center">
        <div class="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 mx-auto text-blue-500" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v1h16v-1c0-2.66-5.33-4-8-4z" />
          </svg>
          <p class="mt-4 text-xl font-bold text-gray-800">{{ candidatos }} candidato</p>
        </div>
      </div>

      <!-- Consumo de tu plan -->
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h3 class="text-lg font-semibold text-gray-700 mb-4">Consumo de tu plan</h3>
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm text-gray-600">Disponible</span>
          <span class="text-sm text-gray-600">Consumo en este proceso</span>
        </div>
        <div class="relative h-4 bg-gray-200 rounded-full overflow-hidden">
          <div class="absolute top-0 left-0 h-4 bg-blue-500 rounded-full" :style="{ width: consumoPlan + '%' }"></div>
        </div>
        <p class="text-sm text-gray-500 mt-2 text-center">Consumo: {{ consumoPlan }}%</p>
      </div>
    </div>

    <!-- Sección de Personalizar Invitación e Invitar a Candidatos -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <!-- Personalizar Invitación -->
      <div
        class="bg-gray-100 p-4 rounded-lg shadow-lg flex items-center justify-between cursor-pointer hover:bg-gray-200"
        @click="abrirModalPersonalizada">
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600 mr-3" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 8l9 6 9-6M3 8v11a2 2 0 002 2h14a2 2 0 002-2V8m-9 4l-4 4m4-4l4 4" />
          </svg>

          <p class="text-gray-700 font-semibold">Personaliza la invitación</p>
        </div>
      </div>

      <!-- Invitar a Candidatos -->
      <div
        class="bg-gray-100 p-4 rounded-lg shadow-lg flex items-center justify-between cursor-pointer hover:bg-gray-200"
        @click="abrirModalCandidatos">
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600 mr-3" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v1h16v-1c0-2.66-5.33-4-8-4z" />
          </svg>
          <p class="text-gray-700 font-semibold">Invita a candidatos</p>
        </div>
        <!-- <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg> -->
      </div>
    </div>

    <!-- Modal de Personalizar Invitación -->
    <PersonalizedInvitation :mostrarModal="mostrarModalPersonalizada" @close="cerrarModalPersonalizada"
      @save="guardarInvitacion" />

    <!-- Modal de Invitar a Candidatos -->
    <InvitationToCandidates :mostrarModalCandidatos="mostrarModalCandidatos" @close="cerrarModalCandidatos" />



    <!-- Componentes evaluados y Duración del proceso -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <!-- Componentes evaluados -->
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h3 class="text-lg font-semibold text-gray-700 mb-4">Componentes evaluados</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div v-for="componente in componentes" :key="componente.nombre"
            class="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow-md">
            <div :class="componente.claseIcono" class="w-14 h-14 rounded-full flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path :d="componente.icono" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
              </svg>
            </div>
            <p class="text-sm font-semibold text-gray-700">{{ componente.nombre }}</p>
            <p class="text-xs text-gray-500">{{ componente.creditos }} Créditos</p>
          </div>
        </div>
      </div>

      <!-- Duración del proceso -->
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h3 class="text-lg font-semibold text-gray-700 mb-4">Duración del proceso</h3>
        <p><span class="font-bold">Desde:</span> {{ fechaInicio }}</p>
        <p class="mt-2"><span class="font-bold">Hasta:</span> {{ fechaFin }}</p>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref } from 'vue';
import DashboardLayout from '@/modules/dashboard/layouts/DashboardLayout.vue';
import PersonalizedInvitation from '@/modules/perfiles/components/PersonalizedInvitation.vue';
import InvitationToCandidates from '@/modules/perfiles/components/InvitationToCandidates.vue';


// Estado del modal para Personalizar la invitación
const mostrarModalPersonalizada = ref(false);

const abrirModalPersonalizada = () => {
  mostrarModalPersonalizada.value = true;
};

const cerrarModalPersonalizada = () => {
  mostrarModalPersonalizada.value = false;
};



// Estado del modal para Invitar a Candidatos
const mostrarModalCandidatos = ref(false);

const abrirModalCandidatos = () => {
  mostrarModalCandidatos.value = true;
};

const cerrarModalCandidatos = () => {
  mostrarModalCandidatos.value = false;
};

// Datos simulados que serían proporcionados por la página anterior
const candidatos = ref(1);
const consumoPlan = ref(20);

// Dinámico: Componentes evaluados con íconos y clases de colores
const componentes = ref([
  { nombre: 'COMPETENCIAS', creditos: 11, claseIcono: 'bg-green-500', icono: 'M3 12a9 9 0 0118 0v3m-9 4a9 9 0 100-18m0 18v4m0-4h4a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2a2 2 0 012-2h4z' },
  { nombre: 'CURRICULUM', creditos: 0, claseIcono: 'bg-purple-500', icono: 'M6 2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z' },
  { nombre: 'DISC', creditos: 6, claseIcono: 'bg-yellow-500', icono: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v1h16v-1c0-2.66-5.33-4-8-4z' },
  { nombre: 'VIDEO ENTREVISTA', creditos: 8, claseIcono: 'bg-blue-500', icono: 'M15 10l4.553-2.276a1 1 0 011.447.894v6.764a1 1 0 01-1.447.894L15 14m0 0l-6 3V7l6 3m0 0v7M21 21H3a2 2 0 01-2-2V5a2 2 0 012-2h18a2 2 0 012 2v14a2 2 0 01-2 2z' },
  { nombre: 'CONOCIMIENTO', creditos: 6, claseIcono: 'bg-pink-500', icono: 'M13 16V8m0 0l-2 2m2-2l2 2m-5 5h6' }
]);

// Duración del proceso (dinámico, viene de la página anterior)
const fechaInicio = ref('16 de julio 2024 - 11:23');

// Crear una instancia de la fecha actual
const fecha = new Date();

// Definir los nombres de los meses
const meses = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];

// Obtener el día, mes y año
const dia = fecha.getDate();
const mes = meses[fecha.getMonth()]; // Obtener el nombre del mes
const anio = fecha.getFullYear();

// Obtener la hora y minutos
const hora = String(fecha.getHours()).padStart(2, '0'); // Asegura 2 dígitos
const minutos = String(fecha.getMinutes()).padStart(2, '0'); // Asegura 2 dígitos

// Crear la variable reactiva con la fecha formateada
const fechaFin = ref(`${dia} de ${mes} ${anio} - ${hora}:${minutos}`);
</script>

<style scoped>
/* Aquí puedes ajustar los estilos del modal, si es necesario */
</style>
