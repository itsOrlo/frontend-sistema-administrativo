<template>
  <Transition name="fade">
    <div
      v-if="mostrarModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div
        class="relative mx-4 w-full max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl"
        @click.stop
      >
        <header class="bg-blue-700 dark:bg-blue-900 px-6 py-4 rounded-t-lg">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-bold text-white">Editar Cliente</h2>
            <button
              @click="handleClose"
              class="text-white hover:text-gray-200 focus:outline-none"
              aria-label="Cerrar modal"
            >
              <span class="text-2xl text-white">&times;</span>
            </button>
          </div>
        </header>

        <div class="p-6 dark:text-gray-300">
          <form @submit.prevent="handleSubmit" cDlass="space-y-4">
            <FormField
              v-for="field in formFields"
              :key="field.id"
              v-model="formData[field.name]"
              v-bind="field"
            />

            <div class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                @click="handleClose"
                class="px-4 py-2 text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="px-4 py-2 text-white bg-blue-700 dark:bg-blue-900 rounded-md hover:bg-blue-600 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {{ isSubmitting ? 'Guardando...' : 'Guardar Cambios' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useApi } from '@/composables/use-api';
import Swal from 'sweetalert2';
import FormField from './FormField.vue';
import type { Cliente } from '../composables/useClients';

interface Props {
  mostrarModal: boolean;
  clienteAEditar: Cliente;
  tiposEmpresa: Record<number, string>;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'cerrar-modal': [];
  'cliente-actualizado': [data: any];
}>();

const isSubmitting = ref(false);
const formData = ref<Cliente>({ ...props.clienteAEditar });

const formFields = computed(() => [
  {
    id: 'empresa',
    name: 'Empresa',
    label: 'Empresa',
    type: 'text',
    required: true,
  },
  {
    id: 'ruc',
    name: 'Ruc',
    label: 'RUC',
    type: 'text',
    required: true,
  },
  {
    id: 'contacto',
    name: 'Contacto',
    label: 'Contacto',
    type: 'text',
    required: true,
  },
  {
    id: 'correo',
    name: 'Correo',
    label: 'Correo',
    type: 'email',
    required: true,
  },
  {
    id: 'telefono',
    name: 'Teléfono',
    label: 'Teléfono',
    type: 'tel',
    required: true,
  },
  {
    id: 'tipoEmpresa',
    name: 'Tipo de empresa',
    label: 'Tipo de Empresa',
    type: 'select',
    options: props.tiposEmpresa,
    required: true,
  },
]);

watch(
  () => props.clienteAEditar,
  (newCliente) => {
    formData.value = { ...newCliente };
  },
);

const handleClose = () => {
  emit('cerrar-modal');
};

const handleSubmit = async () => {
  if (isSubmitting.value) return;

  try {
    isSubmitting.value = true;
    const datosActualizados = {
      ccli_id: formData.value.Acción,
      ctemp_id: formData.value['Tipo de empresa'],
      ccli_empresa: formData.value.Empresa,
      ccli_ruc: formData.value.Ruc,
      ccli_contacto_nombre: formData.value.Contacto,
      ccli_contacto_correo: formData.value.Correo,
      ccli_contacto_telefono: formData.value.Teléfono,
    };

    const response = await useApi.put('/api/v1/consultoria/consultoria-empresa', datosActualizados);

    await Swal.fire({
      icon: 'success',
      title: '¡Cliente actualizado!',
      showConfirmButton: false,
      timer: 2000,
    });

    emit('cliente-actualizado', response.data);
    handleClose();
  } catch (error) {
    console.error('Error al actualizar el cliente:', error);
    await Swal.fire({
      icon: 'error',
      title: 'Error al actualizar el cliente',
      text: 'Por favor, inténtalo de nuevo más tarde.',
    });
  } finally {
    isSubmitting.value = false;
  }
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

/* Agregar estilos para modo oscuro */
.dark .bg-white {
  background-color: #1f2937;
}

.dark .text-gray-700 {
  color: #d1d5db;
}

.dark .border-gray-300 {
  border-color: #4b5563;
}

.dark .hover\:bg-gray-50:hover {
  background-color: #374151;
}
</style>
