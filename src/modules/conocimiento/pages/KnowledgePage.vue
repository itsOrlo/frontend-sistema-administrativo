<template>
  <DashboardLayout>
    <div class="flex-1 flex flex-col">

      <div class="flex items-center justify-between p-4 border-b bg-gray-50">
        <div class="flex items-center">
          <!-- Flecha para regresar -->
          <button @click="goBack" class="mr-2 text-gray-600 hover:text-gray-900">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
              stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 class="text-xl font-semibold">Regresar a configuración del perfil</h1>
          </div>
        </div>
      </div>

      <!-- Mensaje principal -->
      <div class="bg-white p-6 shadow-md text-center mb-8">
        <p class="text-lg font-semibold text-gray-800">No tienes cuestionarios al momento.</p>
        <p class="text-gray-500">Puedes seleccionar cuestionarios predefinidos de Allware o los que han creado otros usuarios.</p>
        <p class="text-gray-500">También puedes crear un nuevo cuestionario personalizado.</p>
      </div>

      <!-- Botones para añadir cuestionarios -->
      <div class="flex justify-center space-x-4 mb-8">
        <button @click="showModal = true" class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 uppercase tracking-wide font-semibold">
          + Cuestionario
        </button>
        <button class="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 uppercase tracking-wide font-semibold">
          + Cuestionario personalizado
        </button>
      </div>

      <!-- Tarjetas de cuestionarios -->
      <div class="flex justify-center">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl w-full">
          <div v-for="(questionario, index) in questionarios" :key="index"
               :class="getCardColor(index)" class="text-white p-4 shadow-md">
            <h3 class="font-semibold text-lg">{{ questionario.name }}</h3>
            <p class="text-sm">{{ questionario.description }}</p>
          </div>
          <!-- Añadir más tarjetas según sea necesario -->
        </div>
      </div>

      <!-- Modal para agregar cuestionarios -->
      <transition name="fade">
        <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 class="text-lg font-semibold mb-4">Agregar nuevo cuestionario</h2>
            <form @submit.prevent="addQuestionario">
              <div class="mb-4">
                <label class="block text-gray-700">Nombre del cuestionario:</label>
                <input v-model="newQuestionario.name" type="text" class="mt-1 block w-full p-2 border border-gray-300 rounded" required />
              </div>
              <div class="mb-4">
                <label class="block text-gray-700">Descripción:</label>
                <textarea v-model="newQuestionario.description" rows="3" class="mt-1 block w-full p-2 border border-gray-300 rounded" required></textarea>
              </div>
              <div class="flex justify-end space-x-2">
                <button @click="showModal = false" type="button" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
                  Cancelar
                </button>
                <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                  Agregar
                </button>
              </div>
            </form>
          </div>
        </div>
      </transition>

    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import DashboardLayout from '@/modules/dashboard/layouts/DashboardLayout.vue';

const router = useRouter();
const goBack = () => {
  router.push({ name: 'perfil-settings' });
};

const questionarios = ref([
  // Puedes iniciar con algunos cuestionarios predefinidos aquí si lo deseas
]);

const newQuestionario = ref({
  name: '',
  description: ''
});

const showModal = ref(false);

const addQuestionario = () => {
  if (newQuestionario.value.name && newQuestionario.value.description) {
    questionarios.value.push({ ...newQuestionario.value });
    newQuestionario.value.name = '';
    newQuestionario.value.description = '';
    showModal.value = false;
  }
};

// Retorna una clase de color para las tarjetas en función del índice
const getCardColor = (index) => {
  const colors = [
    'bg-purple-500',
    'bg-red-500',
    'bg-pink-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-indigo-500'
  ];
  return colors[index % colors.length];
};
</script>
