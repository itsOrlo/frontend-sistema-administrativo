<template>
  <div v-if="mostrarModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div
      class="relative mx-4 w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl"
      @click.stop
    >
      <div class="bg-blue-700 px-6 py-4 rounded-t-lg">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold text-white">Editar Cliente</h2>
          <button
            @click="$emit('cerrar-modal')"
            class="text-white hover:text-gray-200 focus:outline-none"
            aria-label="Cerrar modal"
          >
            <span class="text-2xl">&times;</span>
          </button>
        </div>
      </div>

      <div class="p-6">
        <form @submit.prevent="onSubmit" class="space-y-4">
          <input type="hidden" name="ccli_id" v-model="cliente.Acción" /> 
          <input type="hidden" name="ctemp_id" v-model="cliente['Tipo de empresa']" /> 
          <div>
            <label for="empresa" class="block text-gray-700 font-bold mb-2"> Empresa: </label>
            <input
              type="text"
              id="empresa"
              v-model="cliente.Empresa"
              class="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label for="ruc" class="block text-gray-700 font-bold mb-2"> RUC: </label>
            <input
              type="text"
              id="ruc"
              v-model="cliente.Ruc"
              class="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label for="contacto" class="block text-gray-700 font-bold mb-2"> Contacto: </label>
            <input
              type="text"
              id="contacto"
              v-model="cliente.Contacto"
              class="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label for="correo" class="block text-gray-700 font-bold mb-2"> Correo: </label>
            <input
              type="email"
              id="correo"
              v-model="cliente.Correo"
              class="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label for="telefono" class="block text-gray-700 font-bold mb-2"> Teléfono: </label>
            <input
              type="tel"
              id="telefono"
              v-model="cliente.Teléfono"
              class="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label for="tipoEmpresa" class="block text-gray-700 font-bold mb-2">
              Tipo de Empresa:
            </label>
            <select
              id="tipoEmpresa"
              v-model="cliente['Tipo de empresa']" 
              class="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled selected>Seleccione una opción</option>
              <option v-for="(nombre, id) in tiposEmpresa" :key="id" :value="id">
                {{ nombre }}
              </option>
            </select>
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button
              type="button"
              @click="$emit('cerrar-modal')"
              class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-white bg-blue-700 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useApi } from '@/composables/use-api';
import Swal from 'sweetalert2';
import type { PropType } from 'vue';
import type { Cliente } from '../composables/useClients'; 

const props = defineProps({
  mostrarModal: {
    type: Boolean,
    required: true,
  },
  clienteAEditar: {
    type: Object as PropType<Cliente>,
    required: true,
  },
  tiposEmpresa: {
    type: Object as PropType<{ [key: number]: string }>,
    required: true,
  },
});

const emit = defineEmits(['cerrar-modal', 'cliente-actualizado']);

const cliente = ref({ ...props.clienteAEditar }); 

watch(
  () => props.clienteAEditar,
  (nuevoCliente) => {
    cliente.value = { ...nuevoCliente };
  },
);

const onSubmit = async () => {
  try {
    // Construir el objeto con los datos a actualizar
    const datosActualizados = {
      ccli_id: parseInt(cliente.value.Acción), 
      ctemp_id: cliente.value['Tipo de empresa'], 
      ccli_empresa: cliente.value.Empresa,
      ccli_ruc: cliente.value.Ruc,
      ccli_contacto_nombre: cliente.value.Contacto,
      ccli_contacto_correo: cliente.value.Correo,
      ccli_contacto_telefono: cliente.value.Teléfono,
    };

    const response = await useApi.put(
      `/api/v1/consultoria/consultoria-empresa`,
      datosActualizados 
    );

    await Swal.fire({
      icon: 'success',
      title: '¡Cliente actualizado!',
      showConfirmButton: false,
      timer: 2000,
    });

    emit('cliente-actualizado', response.data); 
    emit('cerrar-modal');
  } catch (error) {
    console.error('Error al actualizar el cliente:', error);
    await Swal.fire({
      icon: 'error',
      title: 'Error al actualizar el cliente',
      text: 'Por favor, inténtalo de nuevo más tarde.',
    });
  }
};
</script>