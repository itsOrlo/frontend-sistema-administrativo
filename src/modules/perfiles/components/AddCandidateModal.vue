<template>
    <div v-if="mostrarModalAgregar" class="fixed inset-0 bg-black bg-opacity-30 z-40 flex items-center justify-center">
      <div class="bg-white rounded-lg w-full max-w-md p-6 relative shadow-lg">
        <h3 class="text-xl font-semibold mb-4">Agregar nuevo candidato</h3>
  
        <!-- Formulario para agregar candidato -->
        <form @submit.prevent="submitForm">
          <div class="mb-4">
            <label for="pais" class="block text-sm font-medium text-gray-700">País</label>
            <select id="pais" v-model="pais" class="block w-full mt-1 border-gray-300 rounded-md shadow-sm">
              <option value="Colombia">Colombia</option>
              <option value="Ecuador">Ecuador</option>
              <option value="Perú">Perú</option>
              <!-- Agrega más opciones de países si es necesario -->
            </select>
          </div>
  
          <div class="mb-4">
            <label for="identificacion" class="block text-sm font-medium text-gray-700">Identificación</label>
            <input type="text" id="identificacion" v-model="identificacion" class="block w-full mt-1 border-gray-300 rounded-md shadow-sm" placeholder="Ingrese la identificación" />
          </div>
  
          <div class="mb-4">
            <label for="nombre" class="block text-sm font-medium text-gray-700">Nombre</label>
            <input type="text" id="nombre" v-model="nombre" class="block w-full mt-1 border-gray-300 rounded-md shadow-sm" placeholder="Ingrese el nombre" />
          </div>
  
          <div class="mb-4">
            <label for="apellido" class="block text-sm font-medium text-gray-700">Apellido</label>
            <input type="text" id="apellido" v-model="apellido" class="block w-full mt-1 border-gray-300 rounded-md shadow-sm" placeholder="Ingrese el apellido" />
          </div>
  
          <!-- Botones de acción -->
          <div class="flex justify-end space-x-3 mt-6">
            <button @click="cerrarModalAgregar" type="button" class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
              CANCELAR
            </button>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              ACEPTAR
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { defineProps, defineEmits } from 'vue';
  
  // Props para mostrar u ocultar el modal
  const props = defineProps({
    mostrarModalAgregar: Boolean
  });
  
  // Emitir eventos para cerrar el modal y enviar los datos
  const emit = defineEmits(['close', 'submit']);
  
  // Variables reactivas del formulario
  const pais = ref('Colombia');
  const identificacion = ref('');
  const nombre = ref('');
  const apellido = ref('');
  
  // Función para cerrar el modal
  const cerrarModalAgregar = () => {
    emit('close');
  };
  
  // Función para enviar el formulario
  const submitForm = () => {
    const candidato = {
      pais: pais.value,
      identificacion: identificacion.value,
      nombre: nombre.value,
      apellido: apellido.value
    };
    emit('submit', candidato);
    cerrarModalAgregar();
  };
  </script>
  
  <style scoped>
  /* Puedes agregar tus estilos personalizados aquí */
  </style>
  