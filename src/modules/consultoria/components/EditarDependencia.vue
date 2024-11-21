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
        <header class="bg-blue-700 px-6 py-4 rounded-t-lg">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-bold text-white">Editar Dependencia</h2>
            <button
              @click="handleClose"
              class="text-white hover:text-gray-200 focus:outline-none"
              aria-label="Cerrar modal"
            >
              <span class="text-2xl text-white">&times;</span>
            </button>
          </div>
        </header>

        <div class="p-6">
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
import { ref, computed, watch } from 'vue';
import { useApi } from '@/composables/use-api';
import Swal from 'sweetalert2';
import FormField from './FormField.vue';
import type { Cliente } from '../composables/useClients';
import type { Dependencia } from '../composables/useDependencias';

interface Props {
  mostrarModal: boolean;
  dependenciaAEditar: Dependencia;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'cerrar-modal': [];
  'dependencia-actualizado': [data: any];
}>();

const isSubmitting = ref(false);
const formData = ref<Dependencia>({ ...props.dependenciaAEditar });

const formFields = computed(() => [
  {
    id: 'cdep_dependencia',
    name: 'cdep_dependencia',
    label: 'Nombre Dependencia',
    type: 'text',
    required: true,
  },
]);

watch(
  () => props.dependenciaAEditar,
  (newDependencia) => {
    formData.value = { ...newDependencia };
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
      cdep_id: formData.value.cdep_id,
      cdep_dependencia: formData.value.cdep_dependencia,
    };

    const response = await useApi.put('/api/v1/consultoria/consultoria-dependencias', datosActualizados);

    await Swal.fire({
      icon: 'success',
      title: '¡Dependencia actualizado!',
      showConfirmButton: false,
      timer: 2000,
    });

    emit('dependencia-actualizado', response.data);
    handleClose();
  } catch (error) {
    console.error('Error al actualizar la dependencia:', error);
    await Swal.fire({
      icon: 'error',
      title: 'Error al actualizar la dependencia',
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
</style>
