<template>
  <div v-if="mostrarModal" class="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
    <div class="bg-white rounded-lg w-full max-w-3xl p-6 relative shadow-lg z-60">
      <h3 class="text-xl font-semibold mb-4">Plantilla de correo electrónico</h3>
      <p class="mb-4">Vista previa del correo electrónico</p>

      <!-- Editor de texto o textarea simple -->
      <textarea v-model="localTextoInvitacion" class="w-full h-40 p-2 border border-gray-300 rounded-md" 
        placeholder="Hola, esta es la invitación para el proceso de evaluación."></textarea>

      <!-- Botones de acción -->
      <div class="mt-6 flex justify-end space-x-4">
        <button @click="cerrarModal" class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 shadow">
          Regresar
        </button>
        <button @click="guardarInvitacion" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 shadow">
          Guardar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue';

// Props para controlar el modal y el texto de la invitación
const props = defineProps({
  mostrarModal: Boolean,
  textoInvitacion: String
});

// Crear una copia local de la prop textoInvitacion
const localTextoInvitacion = ref(props.textoInvitacion);

// Emitir eventos al componente padre
const emit = defineEmits(['close', 'save']);

// Función para cerrar el modal
const cerrarModal = () => {
  emit('close');
};

// Función para guardar la invitación
const guardarInvitacion = () => {
  // Puedes colocar aquí la lógica para manejar el clic en el botón "Aceptar"
  console.log('Botón Aceptar clickeado');
  // Ejemplo: cerrar el modal
  cerrarModal();
};
</script>

<style scoped>
/* Aquí puedes agregar los estilos específicos del modal */
</style>
