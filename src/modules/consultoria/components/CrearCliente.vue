<template>
  <!-- Modal backdrop -->
  <div
    v-if="true"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 gap-12"
    @click.self="$emit('cerrarModal')"
  >
    <!-- Modal content -->
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
      <!-- Modal header -->
      <div class="px-6 py-4 bg-blue-700 rounded-t-lg flex items-center text-center justify-between">
        <h2 class="text-lg font-bold text-center text-white">Registrar Nuevo Cliente</h2>
        <button
          @click="emit('cerrarModal')"
          class="text-white hover:text-gray-200 focus:outline-none"
        >
          <span class="text-2xl">&times;</span>
        </button>
      </div>

      <!-- Modal body -->
      <div class="p-6">
        <form @submit.prevent="onSubmit" class="space-y-4">
          <div class="mb-4">
            <label for="empresa" class="block text-gray-700 font-bold mb-2">Empresa:</label>
            <input
              type="text"
              id="empresa"
              v-model="cliente.ccli_empresa"
              class="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div class="mb-4">
            <label for="ruc" class="block text-gray-700 font-bold mb-2">RUC:</label>
            <input
              type="text"
              id="ruc"
              v-model="cliente.ccli_ruc"
              class="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div class="mb-4">
            <label for="contacto" class="block text-gray-700 font-bold mb-2">Contacto:</label>
            <input
              type="text"
              id="contacto"
              v-model="cliente.ccli_contacto_nombre"
              class="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div class="mb-4">
            <label for="correo" class="block text-gray-700 font-bold mb-2">Correo:</label>
            <input
              type="email"
              id="correo"
              v-model="cliente.ccli_contacto_correo"
              class="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div class="mb-4">
            <label for="telefono" class="block text-gray-700 font-bold mb-2">Teléfono:</label>
            <input
              type="tel"
              id="telefono"
              v-model="cliente.ccli_contacto_telefono"
              class="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div class="mb-4">
            <label for="tipoEmpresa" class="block text-gray-700 font-bold mb-2"
              >Tipo de Empresa:</label
            >
            <select
              id="tipoEmpresa"
              v-model="cliente.ctemp_id"
              class="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="1">Tipo 1</option>
              <option value="2">Tipo 2</option>
            </select>
          </div>

          <!-- Modal footer -->
          <div class="flex justify-end gap-2">
            <button
              type="button"
              @click="emit('cerrarModal')"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
import { ref, defineEmits } from 'vue';
import { useApi } from '@/composables/use-api';
import Swal from 'sweetalert2';

defineProps({
  onSubmitProp: {
    type: Function,
    required: true,
  },
});

const cliente = ref({
  ccli_empresa: '',
  ccli_ruc: '',
  ccli_contacto_nombre: '',
  ccli_contacto_correo: '',
  ccli_contacto_telefono: '',
  ctemp_id: null,
});

const emit = defineEmits(['cerrarModal']);

const onSubmit = async () => {
  try {
    await useApi.post('/api/v1/consultoria/consultoria-empresa', cliente.value);

    Swal.fire({
      icon: 'success',
      title: '¡Cliente registrado!',
      showConfirmButton: false,
      timer: 3000,
    }).then(() => {
      // Limpiar el formulario
      cliente.value = {
        ccli_empresa: '',
        ccli_ruc: '',
        ccli_contacto_nombre: '',
        ccli_contacto_correo: '',
        ccli_contacto_telefono: '',
        ctemp_id: null,
      };

      emit('cerrarModal');
      window.location.reload();
    });
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: 'error',
      title: 'Error al registrar el cliente',
      text: 'Por favor, inténtalo de nuevo más tarde.',
    });
  }
};
</script>

<style scoped>
/* Asegura que el modal se muestre sobre otros elementos */
.z-50 {
  z-index: 50;
}

/* Animación fade para el backdrop */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fixed {
  animation: fadeIn 0.2s ease-in-out;
}

/* Animación para el modal */
@keyframes slideIn {
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.bg-white {
  animation: slideIn 0.2s ease-out;
}
</style>
