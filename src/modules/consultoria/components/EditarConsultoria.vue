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
          <p class="text-sm mb-4">Asunto: {{ consultoriaAEditar?.Asunto }}</p>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="form-group">
              <label for="estado" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Estado:
              </label>
              <select id="estado" v-model="formData.estado"
                class="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm leading-5 text-gray-900 dark:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option v-for="estado in estadosFiltrados" :key="estado.conre_id" :value="estado.conre_id">
                  {{ estado.conre_nombre }}
                </option>
              </select>
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
              <button type="button" @click="handleAddActivity"
                class="px-4 py-2 text-white bg-green-700 dark:bg-green-600 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
                Añadir actividad
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useApi } from '@/composables/use-api';
import Swal from 'sweetalert2';
import type { Consultoria } from '../composables/useConsultoria';
import { useActivities } from '../composables/useActivities';

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
  estado: 0,
});

const estadosFiltrados = computed(() => {
  return props.estadosConsultoria.filter(estado => {
    if (estado.conre_nombre === 'Por despachar') {
      return props.consultoriaAEditar?.conre_id === estado.conre_id;
    }
    return true;
  });
});

watch(
  () => props.consultoriaAEditar,
  (newConsultoria) => {
    if (newConsultoria) {
      formData.value = {
        estado: Number(newConsultoria.conre_id) || 0,
      };
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
    const formDataToSend = new FormData();
    formDataToSend.append('conr_tramite', String(props.consultoriaAEditar?.['N° Trámite'] || ''));
    formDataToSend.append('conre_id', formData.value.estado.toString());

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

const { createActivity } = useActivities();

const handleAddActivity = async () => {
  if (!props.consultoriaAEditar) return;

  const { value: formValues } = await Swal.fire({
    title: 'Añadir actividad',
    html: `
      <div class="space-y-2">
        <div>
          <label for="fecha" class="block text-sm font-medium text-gray-700">Fecha:</label>
          <input id="fecha" type="date" class="swal2-input w-3/4 mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" value="${new Date().toISOString().split('T')[0]}">
        </div>
        <div>
          <label for="estado" class="block text-sm font-medium text-gray-700">Estado:</label>
          <select id="estado" class="swal2-select w-3/4 mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50">
            ${props.estadosConsultoria.map(estado => `<option value="${estado.conre_id}">${estado.conre_nombre}</option>`).join('')}
          </select>
        </div>
        <div>
          <label for="observacion" class="block text-sm font-medium text-gray-700">Observación:</label>
          <textarea id="observacion" class="swal2-textarea w-3/4 mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" placeholder="Escribe aquí..."></textarea>
        </div>
      </div>
    `,
    customClass: {
      popup: 'swal2-popup-custom'
    },
    focusConfirm: false,
    showCancelButton: true,
    preConfirm: () => {
      const fecha = (document.getElementById('fecha') as HTMLInputElement).value;
      const estado = (document.getElementById('estado') as HTMLSelectElement).value;
      const observacion = (document.getElementById('observacion') as HTMLTextAreaElement).value;
      if (!observacion) {
        Swal.showValidationMessage('¡Necesitas escribir algo!');
        return null;
      }
      return { fecha, estado, observacion };
    }
  });

  if (formValues) {
    try {
      const fechaDespacho = new Date(formValues.fecha);
      fechaDespacho.setDate(fechaDespacho.getDate() + 1);

      await createActivity({
        conr_tramite: String(props.consultoriaAEditar['N° Trámite']),
        conr_fecha_despacho: fechaDespacho.toISOString().split('T')[0],
        conre_id: Number(formValues.estado),
        conr_observacion: formValues.observacion,
      });

      // Actualizar el estado del modal Editar Consultoría
      formData.value.estado = Number(formValues.estado);

      await Swal.fire({
        icon: 'success',
        title: '¡Actividad añadida!',
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.error('Error al añadir actividad:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error al añadir actividad',
        text: 'Por favor, inténtalo de nuevo más tarde.',
      });
    }
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

.swal2-popup-custom {
  width: 500px !important;
  max-width: 90%;
}
</style>
