<template>
  <div
    v-if="true"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
  >
    <!-- Modal container con scroll -->
    <div 
      class="relative mx-4 w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-blue-700 px-6 py-4 rounded-t-lg">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold text-white">Registrar Nuevo Cliente</h2>
          <button
            @click="emit('cerrarModal')"
            class="text-white hover:text-gray-200 focus:outline-none"
            aria-label="Cerrar modal"
          >
            <span class="text-2xl">&times;</span>
          </button>
        </div>
      </div>

      <!-- Form -->
      <div class="p-6">
        <form @submit.prevent="onSubmit" class="space-y-4">
          <!-- Empresa -->
          <div>
            <label for="empresa" class="block text-gray-700 font-bold mb-2">
              Empresa:
            </label>
            <input
              type="text"
              id="empresa"
              v-model="cliente.ccli_empresa"
              class="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <!-- RUC -->
          <div>
            <label for="ruc" class="block text-gray-700 font-bold mb-2">
              RUC:
            </label>
            <input
              type="text"
              id="ruc"
              v-model="cliente.ccli_ruc"
              class="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <!-- Contacto -->
          <div>
            <label for="contacto" class="block text-gray-700 font-bold mb-2">
              Contacto:
            </label>
            <input
              type="text"
              id="contacto"
              v-model="cliente.ccli_contacto_nombre"
              class="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <!-- Correo -->
          <div>
            <label for="correo" class="block text-gray-700 font-bold mb-2">
              Correo:
            </label>
            <input
              type="email"
              id="correo"
              v-model="cliente.ccli_contacto_correo"
              class="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <!-- Teléfono -->
          <div>
            <label for="telefono" class="block text-gray-700 font-bold mb-2">
              Teléfono:
            </label>
            <input
              type="tel"
              id="telefono"
              v-model="cliente.ccli_contacto_telefono"
              class="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <!-- Tipo Empresa -->
          <div>
            <label for="tipoEmpresa" class="block text-gray-700 font-bold mb-2">
              Tipo de Empresa:
            </label>
            <select
              id="tipoEmpresa"
              v-model="cliente.ctemp_id"
              class="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled selected>Seleccione una opción</option>
              <option value="1">Tipo 1</option>
              <option value="2">Tipo 2</option>
            </select>
          </div>

          <!-- Buttons -->
          <div class="flex justify-end gap-3 pt-4">
            <button
              type="button"
              @click="emit('cerrarModal')"
              class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-white bg-blue-700 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Crear Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useApi } from '@/composables/use-api';
import Swal from 'sweetalert2';

const cliente = ref({
  ccli_empresa: '',
  ccli_ruc: '',
  ccli_contacto_nombre: '',
  ccli_contacto_correo: '',
  ccli_contacto_telefono: '',
  ctemp_id: '',
});

const emit = defineEmits(['cerrarModal', 'cliente-creado']);

const onSubmit = async () => {
  try {
    const response = await useApi.post('/api/v1/consultoria/consultoria-empresa', cliente.value);

    await Swal.fire({
      icon: 'success',
      title: '¡Cliente registrado!',
      showConfirmButton: false,
      timer: 2000,
    });

    // Emitir evento y cerrar modal
    emit('cliente-creado', response.data);
    emit('cerrarModal');
  } catch (error) {
    console.error('Error al registrar el cliente:', error);
    await Swal.fire({
      icon: 'error',
      title: 'Error al registrar el cliente',
      text: 'Por favor, inténtalo de nuevo más tarde.',
    });
  }
};
</script>

<style scoped>
@keyframes modalFade {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bg-white {
  animation: modalFade 0.3s ease-out;
}
</style>