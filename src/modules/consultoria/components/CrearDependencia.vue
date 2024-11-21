<template>
  <Transition name="fade">
    <div
      v-if="mostrarModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div
        class="relative mx-4 w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl"
        @click.stop
      >
        <div class="bg-blue-700 px-6 py-4 rounded-t-lg">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-bold text-white">Registrar Nueva Dependencia</h2>
            <button
              @click="handleClose"
              class="text-white hover:text-gray-200 focus:outline-none"
              aria-label="Cerrar modal"
            >
              <span class="text-2xl">&times;</span>
            </button>
          </div>
        </div>
        <div class="p-6">
          <form @submit.prevent="handleSubmit" class="space-y-4">
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
                class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="px-4 py-2 text-white bg-blue-700 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
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
import { ref, computed } from 'vue';
import { useApi } from '@/composables/use-api';
import Swal from 'sweetalert2';
import FormField from './FormField.vue';

interface Props {
  mostrarModal: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  'cerrar-modal': [];
  'dependencia-creada': [data: any];
}>();

interface FormData {
  [key: string]: string; // Index signature para propiedades dinámicas
}

const isSubmitting = ref(false);
const formData = ref<FormData>({}); // Objeto FormData vacío

const formFields = computed(() => [
  {
    id: 'cdep_dependencia',
    name: 'cdep_dependencia',
    label: 'Nombre Dependencia',
    type: 'text',
    required: true,
  },
]);

const handleClose = () => {
  emit('cerrar-modal');
};

const handleSubmit = async () => {
  if (isSubmitting.value) return;

  try {
    isSubmitting.value = true;
    const datosRegistro = {
      cdep_dependencia: formData.value.cdep_dependencia,
    };

    const response = await useApi.post('/api/v1/consultoria/consultoria-dependencias', datosRegistro);

    await Swal.fire({
      icon: 'success',
      title: '¡Dependencia registrado!',
      showConfirmButton: false,
      timer: 2000,
    });

    emit('dependencia-creada', response.data);
    handleClose();

    // Esperar 2 segundos y recargar la página
    setTimeout(() => {
      window.location.reload();
    }, 2000);

  } catch (error) {
    console.error('Error al registrar dependencia:', error);
    await Swal.fire({
      icon: 'error',
      title: 'Error al registrar dependencia',
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
</style> 1