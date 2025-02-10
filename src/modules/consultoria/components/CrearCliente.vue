<template>
  <Transition name="fade">
    <div v-if="mostrarModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="relative mx-4 w-full max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl" @click.stop>
        <div class="bg-blue-700 dark:bg-blue-900 px-6 py-4 rounded-t-lg">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-bold text-white">Registrar Nuevo Cliente</h2>
            <button @click="handleClose" class="text-white hover:text-gray-200 focus:outline-none"
              aria-label="Cerrar modal">
              <span class="text-2xl text-white">&times;</span>
            </button>
          </div>
        </div>
        <div class="p-6">
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <FormField v-for="field in formFields" :key="field.id" :modelValue="formData[field.name] ?? ''"
              @update:modelValue="value => (formData[field.name as keyof FormData] = value as never)" v-bind="field" />
            <div class="flex justify-end gap-3 pt-4">
              <button type="button" @click="handleClose"
                class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600">
                Cancelar
              </button>
              <button type="submit" :disabled="isSubmitting"
                class="px-4 py-2 text-white bg-blue-700 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 dark:bg-blue-900 dark:hover:bg-blue-800">
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
  tiposEmpresa: Record<number, string>;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'cerrar-modal': [];
  'cliente-creado': [data: any];
}>();
interface FormData {
  Empresa: string;
  Ruc: string;
  Contacto: string;
  Correo: string;
  Teléfono: string | null;
  'Tipo de empresa': number | null;
}

const isSubmitting = ref(false);
const formData = ref<FormData>({
  Empresa: '',
  Ruc: '',
  Contacto: '',
  Correo: '',
  Teléfono: null,
  'Tipo de empresa': null,
});

type FormFieldType = {
  id: string;
  name: keyof FormData;
  label: string;
  type: string;
  required: boolean;
  options?: Record<number, string>;
};

const formFields = computed<FormFieldType[]>(() => [
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

const handleClose = () => {
  emit('cerrar-modal');
};

const handleSubmit = async () => {
  if (isSubmitting.value) return;

  try {
    isSubmitting.value = true;
    const datosRegistro = {
      ctemp_id: formData.value['Tipo de empresa'],
      ccli_empresa: formData.value.Empresa,
      ccli_ruc: formData.value.Ruc,
      ccli_contacto_nombre: formData.value.Contacto,
      ccli_contacto_correo: formData.value.Correo,
      ccli_contacto_telefono: formData.value['Teléfono'],
    };

    const response = await useApi.post('/api/v1/consultoria/consultoria-empresa', datosRegistro);
    /*  */
    await Swal.fire({
      icon: 'success',
      title: '¡Cliente registrado!',
      showConfirmButton: false,
      timer: 2000,
    });

    emit('cliente-creado', response.data);
    handleClose();
  } catch (error) {
    console.error('Error al registrar cliente:', error);
    await Swal.fire({
      icon: 'error',
      title: 'Error al registrar cliente',
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

/* Modo oscuro */
.dark .bg-white {
  background-color: #1f2937;
}

.dark .text-gray-700 {
  color: #d1d5db;
}

.dark .bg-blue-700 {
  background-color: #1e40af;
}

.dark .hover\:bg-gray-50:hover {
  background-color: #374151;
}

.dark .border-gray-300 {
  border-color: #4b5563;
}

.dark .hover\:bg-blue-600:hover {
  background-color: #1d4ed8;
}

.dark .focus\:ring-blue-500:focus {
  outline-color: #3b82f6;
}
</style>
