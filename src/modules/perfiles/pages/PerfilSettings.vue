<template>
  <DashboardLayout>
    <!-- Contenido principal -->
    <div class="flex-1 flex flex-col">
      <!-- Encabezado -->
      <header class="bg-white shadow p-4 flex justify-between items-center">
        <h1 class="text-xl font-semibold">Edición del perfil - Desarrollador de software</h1>
      </header>

      <!-- Contenido del cuerpo -->
      <div class="p-6 space-y-6">
        <!-- Sección de Configuración -->
        <div class="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <h2 class="text-lg font-semibold text-blue-600">Proceso E-Talent</h2>
          <p class="text-gray-600 mt-2">
            Para lanzar procesos E-Talent debes cumplir con los siguientes requisitos: ...
          </p>
        </div>

        <!-- Formulario y Paneles de Configuración -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Formulario de edición -->
          <div class="bg-white shadow p-4 rounded-lg md:col-span-2">
            <!-- Nombre -->
            <div class="mb-4">
              <label for="nombre" class="block text-sm font-medium text-gray-700">Nombre</label>
              <input type="text" id="nombre" v-model="nombre"  class="mt-1 block w-full border-gray-300 rounded-md">
            </div>
            <!-- Nivel -->
            <div class="mb-4">
              <label for="nivel" class="block text-sm font-medium text-gray-700">Nivel del perfil</label>
              <input type="text" id="nombre" v-model="nivel"  class="mt-1 block w-full border-gray-300 rounded-md">

            </div>
            <!-- Descripción -->
            <div class="mb-4">
              <label for="descripcion" class="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea id="descripcion" class="mt-1 block w-full border-gray-300 rounded-md" rows="5"></textarea>
            </div>
            <!-- Responsabilidades -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Responsabilidades</label>
              <textarea class="mt-1 block w-full border-gray-300 rounded-md" rows="5"></textarea>
            </div>
            <!-- Requisitos -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Requisitos</label>
              <textarea class="mt-1 block w-full border-gray-300 rounded-md" rows="5"></textarea>
            </div>
          </div>

          <!-- Paneles de Configuración y Sumatoria de pesos -->
          <div class="space-y-4 flex flex-col">
            <div class="bg-white shadow p-4 rounded-lg flex-1 ">
              <div class="flex justify-between items-center mb-2">
                <h3 class="text-sm font-semibold text-gray-700">DISC</h3>
                <span class="text-green-500">Completo</span>
              </div>
            </div>

            <div class="bg-white shadow p-4 rounded-lg flex-1 cursor-pointer">
              <div @click="irACurriculum"
                class="flex justify-between items-center mb-2 hover:bg-gray-200 transition-colors duration-200 p-2 rounded">
                <h3 class="text-sm font-semibold text-gray-700">CURRICULUM</h3>
                <span class="text-red-500">Pendiente</span>
              </div>
              <!-- Slider para el peso -->
              <div class="relative">
                <input type="range" min="0" max="100" v-model="pesoCurriculum"
                  class="w-full h-2 bg-gray-200 rounded-lg overflow-hidden appearance-none cursor-pointer accent-red-500">
                <span
                  class="absolute left-1/2 transform -translate-x-1/2 -top-6 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-md">{{
                    pesoCurriculum }}%</span>
              </div>
            </div>

            <div class="bg-white shadow p-4 rounded-lg flex-1 cursor-pointer">
              <div @click="irAKnowledge"
                class="flex justify-between items-center mb-2 hover:bg-gray-200 transition-colors duration-200 p-2 rounded">
                <h3 class="text-sm font-semibold text-gray-700">CONOCIMIENTO</h3>
                <span class="text-blue-500">Pendiente</span>
              </div>
              <!-- Slider para el peso -->
              <div class="relative">
                <input type="range" min="0" max="100" v-model="pesoConocimiento"
                  class="w-full h-2 bg-gray-200 rounded-lg overflow-hidden appearance-none cursor-pointer accent-blue-500">
                <span
                  class="absolute left-1/2 transform -translate-x-1/2 -top-6 bg-blue-500 text-white text-xs px-2 py-1 rounded-full shadow-md">{{
                    pesoConocimiento }}%</span>
              </div>
            </div>

            <div class="bg-white shadow p-4 rounded-lg flex-1 cursor-pointer">
              <div @click="irACompetencia"
                class="flex justify-between items-center mb-2 hover:bg-gray-200 transition-colors duration-200 p-2 rounded">
                <h3 class="text-sm font-semibold text-gray-700">COMPETENCIAS</h3>
                <span class="text-purple-500">Pendiente</span>
              </div>
              <!-- Slider para el peso -->
              <div class="relative">
                <input type="range" min="0" max="100" v-model="pesoCompetencias"
                  class="w-full h-2 bg-gray-200 rounded-lg overflow-hidden appearance-none cursor-pointer accent-purple-500">
                <span
                  class="absolute left-1/2 transform -translate-x-1/2 -top-6 bg-purple-500 text-white text-xs px-2 py-1 rounded-full shadow-md">{{
                    pesoCompetencias }}%</span>
              </div>
            </div>

            <div class="bg-white shadow p-4 rounded-lg flex-1 cursor-pointer">
              <div @click="irAEntrevista"
                class="flex justify-between items-center mb-2 hover:bg-gray-200 transition-colors duration-200 p-2 rounded">
                <h3 class="text-sm font-semibold text-gray-700">VIDEO ENTREVISTA</h3>
                <span class="text-red-500">Pendiente</span>
              </div>
              <!-- Slider para el peso -->
              <div class="relative">
                <input type="range" min="0" max="100" v-model="pesoVideoEntrevista"
                  class="w-full h-2 bg-gray-200 rounded-lg overflow-hidden appearance-none cursor-pointer accent-orange-500">
                <span
                  class="absolute left-1/2 transform -translate-x-1/2 -top-6 bg-orange-500 text-white text-xs px-2 py-1 rounded-full shadow-md">{{
                    pesoVideoEntrevista }}%</span>
              </div>
            </div>

            <div class="bg-white shadow p-4 rounded-lg">
              <h3 class="text-lg font-semibold text-yellow-500">Sumatoria de pesos</h3>
              <div class="flex items-center mt-2">
                <div class="h-24 w-24 rounded-full border-4 border-yellow-500 flex items-center justify-center">
                  <span class="text-2xl font-bold">{{ sumatoriaPesos }}%</span>
                </div>
                <p class="text-gray-600 ml-4">Importante: los pesos configurados deben sumar 100%.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Botón de acción flotante -->
      <button @click="mostrarModal = true" :disabled="sumatoriaPesos !== 100"
        class="fixed bottom-4 right-4 bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-green-600"
        :class="{ 'opacity-50 cursor-not-allowed': sumatoriaPesos !== 100 }">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H5a1 1 0 110-2h3V6a1 1 0 011-1z"
            clip-rule="evenodd" />
        </svg>
      </button>

      <!-- Modal -->
      <transition name="fade">
    <div v-if="mostrarModal" @click.self="cerrarModal"
      class="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 relative shadow-lg w-96 text-center z-60">
        <h3 class="text-lg font-semibold mb-4">¿Qué deseas hacer con tu nuevo perfil?</h3>
        <p class="text-gray-600 mb-6">Puedes lanzar un proceso con este perfil o ver todos los perfiles.</p>

        <div class="flex justify-center space-x-6">
          <button @click="cerrarModal" class="text-blue-600 hover:underline">Permanecer</button>
          <button @click="irAPerfiles" class="text-blue-600 hover:underline">Perfiles</button>
          <button @click="irAProceso" class="text-blue-600 hover:underline">Lanzar proceso</button>
        </div>

        <button @click="cerrarModal" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-70">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
            stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </transition>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import DashboardLayout from '@/modules/dashboard/layouts/DashboardLayout.vue';
import { usePerfilStore } from '@/stores/use-perfil.store';

const perfilStore = usePerfilStore();
const nombre = perfilStore.nombre;
const nivel = perfilStore.nivel;
// const opciones = perfilStore.opciones;

const router = useRouter();

const irACurriculum = () => {
  router.replace('/curriculum');
};

const irAKnowledge = () => {
  router.replace('/conocimiento');
};

const irACompetencia = () => {
  router.replace('/competencia');
};

const irAEntrevista = () => {
  router.replace('/videoEntrevista');
};

const irAPerfiles = () => {
  router.replace('/perfiles');
}
const irAProceso = () => {
  router.replace('/perfil-launch');
}

const pesoCurriculum = ref(10);
const pesoConocimiento = ref(10);
const pesoCompetencias = ref(42);
const pesoVideoEntrevista = ref(25);

// Computed para la sumatoria de los pesos
const sumatoriaPesos = computed(() => {
  const p1 = Math.round(pesoConocimiento.value);
  const p2 = Math.round(pesoCompetencias.value);
  const p3 = Math.round(pesoVideoEntrevista.value);
  const p4 = Math.round(pesoCurriculum.value);
  const total = p1 + p2 + p3 + p4;
  return total;
});

// Estado para controlar el modal
const mostrarModal = ref(false);
const cerrarModal = () => {
  mostrarModal.value = false;
}
</script>
