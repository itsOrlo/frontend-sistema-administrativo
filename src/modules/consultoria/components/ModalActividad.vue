<template>
  <Transition name="fade">
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="relative mx-4 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl" @click.stop>
        <div class="bg-green-700 dark:bg-green-900 px-6 py-4 rounded-t-lg">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-bold text-white">Añadir Actividad</h2>
            <button @click="handleClose" class="text-white hover:text-gray-200 focus:outline-none" aria-label="Cerrar modal">
              <span class="text-2xl text-white">&times;</span>
            </button>
          </div>
        </div>
        <div class="p-6">
          <div class="text-center mb-4">
            <h1 class="text-xl font-bold">Trámite: {{ props.consultoriaAEditar?.['N° Trámite'] }}</h1>
            <p class="text-sm">Estado actual: {{ getEstadoNombre(Number(props.consultoriaAEditar?.conre_id) || undefined) }}</p>
          </div>
          <form @submit.prevent="handleAddActivity" class="space-y-4">
            <div class="form-group">
              <label for="fecha" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fecha:
              </label>
              <input id="fecha" type="date" v-model="formValues.fecha"
                class="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm leading-5 text-gray-900 dark:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
            </div>
            <div class="form-group">
              <label for="estado" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Estado:
              </label>
              <select id="estado" v-model="formValues.estado"
                class="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm leading-5 text-gray-900 dark:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option v-for="estado in estadosFiltrados" :key="estado.conre_id" :value="estado.conre_id">
                  {{ estado.conre_nombre }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="observacion" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Observación:
              </label>
              <textarea id="observacion" v-model="formValues.observacion"
                class="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm leading-5 text-gray-900 dark:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Escribe aquí..."></textarea>
            </div>
            <div class="flex justify-end gap-3 pt-4">
              <button type="button" @click="handleClose"
                class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Cancelar
              </button>
              <button type="submit"
                class="px-4 py-2 text-white bg-green-700 dark:bg-green-600 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
                Añadir
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
import Swal from 'sweetalert2';
import { useActivities } from '../composables/useActivities';
import type { Consultoria } from '../composables/useConsultoria';

interface Props {
  estadosConsultoria: { conre_id: number; conre_nombre: string }[];
  consultoriaAEditar: Consultoria | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'cerrar-modal': [];
  'actividad-anadida': [estado: number];
}>();

const showModal = ref(true);
const formValues = ref({
  fecha: new Date().toISOString().split('T')[0],
  estado: props.consultoriaAEditar?.conre_id || props.estadosConsultoria[0]?.conre_id || 0,
  observacion: '',
});

watch(
  () => props.consultoriaAEditar,
  (newConsultoria) => {
    if (newConsultoria) {
      formValues.value.estado = newConsultoria.conre_id || 0;
    }
  },
  { immediate: true }
);

const { createActivity } = useActivities();

const handleClose = () => {
  emit('cerrar-modal');
};

const handleAddActivity = async () => {
  if (!props.consultoriaAEditar || !formValues.value.observacion) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Por favor, completa todos los campos.',
    });
    return;
  }

  try {
    const fechaDespacho = new Date(formValues.value.fecha);
    fechaDespacho.setDate(fechaDespacho.getDate()+1);

    await createActivity({
      conr_tramite: String(props.consultoriaAEditar['N° Trámite']),
      conr_fecha_despacho: fechaDespacho.toISOString().split('T')[0],
      conre_id: Number(formValues.value.estado),
      conr_observacion: formValues.value.observacion,
    });

    emit('actividad-anadida', Number(formValues.value.estado));

    await Swal.fire({
      icon: 'success',
      title: '¡Actividad añadida!',
      showConfirmButton: false,
      timer: 2000,
    });

    handleClose();
  } catch (error) {
    console.error('Error al añadir actividad:', error);
    await Swal.fire({
      icon: 'error',
      title: 'Error al añadir actividad',
      text: 'Por favor, inténtalo de nuevo más tarde.',
    });
  }
};

const getEstadoNombre = (conre_id: number | undefined) => {
  const estado = props.estadosConsultoria.find(e => e.conre_id === conre_id);
  return estado ? estado.conre_nombre : 'Desconocido';
};

const estadosFiltrados = computed(() => {
  return props.estadosConsultoria.filter(estado => {
    if (estado.conre_nombre === 'Por despachar') {
      return props.consultoriaAEditar?.conre_id === estado.conre_id;
    }
    return true;
  });
});
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
