<template>
  <Transition name="fade">
    <div v-if="mostrarModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="relative mx-4 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl" @click.stop>
        <div class="bg-blue-700 dark:bg-blue-900 px-6 py-4 rounded-t-lg">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-bold text-white">Editar Consultoría</h2>
            <button @click="handleClose" class="text-white hover:text-gray-200 focus:outline-none" aria-label="Cerrar modal">
              <span class="text-2xl text-white">&times;</span>
            </button>
          </div>
        </div>
        <div class="p-6">
          <h1 class="text-2xl font-bold mb-4">Trámite: {{ consultoriaAEditar?.['N° Trámite'] }}</h1>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="form-group">
              <label for="asunto" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Asunto:
              </label>
              <textarea id="asunto" v-model="formData.asunto"
                class="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm leading-5 text-gray-900 dark:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
                placeholder="Ingrese el asunto..." rows="4"></textarea>
            </div>

            <div class="form-group">
              <label for="fecha-despacho" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fecha de despacho:
              </label>
              <input type="date" id="fecha-despacho" v-model="formData.fechaDespacho"
                class="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm leading-5 text-gray-900 dark:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>

            <div class="form-group">
              <label for="estado" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Estado:
              </label>
              <select id="estado" v-model="formData.estado"
                class="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm leading-5 text-gray-900 dark:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option v-for="estado in estadosConsultoria" :key="estado.conre_id" :value="estado.conre_nombre">
                  {{ estado.conre_nombre }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="observacion" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Observación:
              </label>
              <textarea id="observacion" v-model="formData.observacion"
                class="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm leading-5 text-gray-900 dark:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
                placeholder="Ingrese la observación..." rows="4"></textarea>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button type="button" @click="handleClose"
                class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Cancelar
              </button>
              <button type="submit" :disabled="isSubmitting"
                class="px-4 py-2 text-white bg-blue-700 dark:bg-blue-600 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50">
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
import { ref, watch } from 'vue';
import { useApi } from '@/composables/use-api';
import Swal from 'sweetalert2';
import type { Consultoria } from '../composables/useConsultoria';

interface Props {
  mostrarModal: boolean;
  consultoriaAEditar: Consultoria | null;
  estadosConsultoria: { conre_id: number; conre_nombre: string }[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'cerrar-modal': [];
  'consultoria-actualizada': [data: any];
}>();

const isSubmitting = ref(false);
const formData = ref({
  asunto: '',
  fechaDespacho: '',
  estado: '',
  observacion: '',
  cdep_id: 0,
  ccli_id: 0,
});

watch(
  () => props.consultoriaAEditar,
  async (newConsultoria) => {
    if (newConsultoria) {
      console.log('Nueva consultoria a editar:', newConsultoria);
      const response = await useApi.get(`/api/v1/consultoria/consultoria-registro-tramite?conr_tramite=${newConsultoria['N° Trámite']}`);
      const data = response.data[0]; // Asegurarse de obtener el primer objeto del array
      if (data) {
        console.log('Datos de la API para la consultoria:', data);
        formData.value = {
          asunto: data.Asunto || '',
          fechaDespacho: data['Fecha despacho'] || '',
          estado: data.Estado || '',
          observacion: data.Observación || '',
          cdep_id: data.cdep_id || 0,
          ccli_id: data.ccli_id || 0,
        };
      } else {
        console.error('Error: No se encontraron datos para la consultoría.');
      }
    }
  },
  { immediate: true }
);

const handleClose = () => {
  emit('cerrar-modal');
};

const handleSubmit = async () => {
  if (isSubmitting.value) return;

  try {
    isSubmitting.value = true;
    console.log('Datos del formulario antes de enviar:', formData.value);
    const formDataToSend = new FormData();
    formDataToSend.append('conr_tramite', props.consultoriaAEditar?.['N° Trámite'] || '');
    formDataToSend.append('cdep_id', formData.value.cdep_id.toString());
    formDataToSend.append('ccli_id', formData.value.ccli_id.toString());
    formDataToSend.append('conr_fecha_registro', props.consultoriaAEditar?.['Fecha registro'] || '');
    formDataToSend.append('conr_fecha_despacho', formData.value.fechaDespacho);
    formDataToSend.append('conr_asunto', formData.value.asunto);
    formDataToSend.append('conre_id', formData.value.estado);
    formDataToSend.append('conr_observacion', formData.value.observacion);

    const response = await useApi.put(`/api/v1/consultoria/consultoria-registro-tramite?conr_tramite=${props.consultoriaAEditar?.['N° Trámite']}`, formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    await Swal.fire({
      icon: 'success',
      title: '¡Consultoría actualizada!',
      showConfirmButton: false,
      timer: 2000,
    });

    emit('consultoria-actualizada', response.data);
    handleClose();
  } catch (error) {
    console.error('Error al actualizar consultoría:', error);
    await Swal.fire({
      icon: 'error',
      title: 'Error al actualizar consultoría',
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
