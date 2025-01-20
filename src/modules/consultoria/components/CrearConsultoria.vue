<template>
  <Transition name="fade">
    <div v-if="mostrarModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="relative mx-4 w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl" @click.stop>
        <div class="bg-blue-700 px-6 py-4 rounded-t-lg">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-bold text-white">Registrar Nueva Consultoría</h2>
            <button @click="handleClose" class="text-white hover:text-gray-200 focus:outline-none"
              aria-label="Cerrar modal">
              <span class="text-2xl text-white">&times;</span>
            </button>
          </div>
        </div>
        <div class="p-6">
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="grid grid-cols-2 gap-6">
              <!-- Columna izquierda -->
              <div class="space-y-4">
                <div class="form-group">
                  <label for="dependencia" class="block text-sm font-medium text-gray-700 mb-1">
                    Dependencia:
                  </label>
                  <Combobox v-model="formData.dependenciaId" as="div" class="relative">
                    <div class="relative">
                      <ComboboxInput
                        class="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        :displayValue="(id) => getDependenciaName(id)" @change="busqueda = $event.target.value"
                        placeholder="Buscar dependencia..." />
                      <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </ComboboxButton>
                    </div>
                    <ComboboxOptions
                      class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      <ComboboxOption v-for="(nombre, id) in dependenciasFiltered" :key="id" :value="Number(id)"
                        v-slot="{ selected, active }">
                        <li class="relative cursor-default select-none py-2 pl-3 pr-9" :class="{
                          'bg-blue-600 text-white': active,
                          'text-gray-900': !active
                        }">
                          <span class="block truncate" :class="{ 'font-medium': selected, 'font-normal': !selected }">
                            {{ nombre }}
                          </span>
                        </li>
                      </ComboboxOption>
                    </ComboboxOptions>
                  </Combobox>
                </div>

                <div class="form-group">
                  <label for="cliente" class="block text-sm font-medium text-gray-700 mb-1">
                    Remitente:
                  </label>
                  <Combobox v-model="formData.clienteId" as="div" class="relative">
                    <div class="relative">
                      <ComboboxInput
                        class="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        :displayValue="(id) => props.clientes[id as number] || ''"
                        @change="busquedaCliente = $event.target.value" placeholder="Buscar cliente..." />
                      <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </ComboboxButton>
                    </div>
                    <ComboboxOptions
                      class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      <ComboboxOption v-for="(nombre, id) in clientesFiltrados" :key="id" :value="id"
                        v-slot="{ selected, active }">
                        <li class="relative cursor-default select-none py-2 pl-3 pr-9" :class="{
                          'bg-blue-600 text-white': active,
                          'text-gray-900': !active
                        }">
                          <span class="block truncate" :class="{ 'font-medium': selected, 'font-normal': !selected }">
                            {{ nombre }}
                          </span>
                        </li>
                      </ComboboxOption>
                    </ComboboxOptions>
                  </Combobox>
                </div>
              </div>

              <!-- Columna derecha -->
              <div class="space-y-4">
                <div class="form-group">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de registro:
                  </label>
                  <input type="text" :value="fechaActual" disabled
                    class="w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 text-sm text-gray-700" />
                </div>
              </div>
            </div>

            <!-- Input Asunto -->
            <div class="form-group col-span-2">
              <label for="asunto" class="block text-sm font-medium text-gray-700 mb-1">
                Asunto:
              </label>
              <textarea id="asunto" v-model="formData.asunto"
                class="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm leading-5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
                placeholder="Ingrese el asunto..." rows="4"></textarea>
            </div>

            <div class="form-group col-span-2">
              <label for="archivo" class="block text-sm font-medium text-gray-700 mb-2">
                Subir Archivo
              </label>
              <div v-if="formData.archivo"
                class="flex items-center justify-between p-3 border border-gray-300 rounded-md mb-2">
                <span>{{ formData.archivo.name }}</span>
                <button @click="eliminarArchivo" class="text-red-500 hover:text-red-700">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </button>
              </div>
              <div ref="dropArea"
                class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
                @dragover="onDragOver" @dragleave="onDragLeave" @drop="onDrop">
                <div class="space-y-1 text-center">
                  <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48"
                    aria-hidden="true">
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 40"
                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <div class="flex text-sm text-gray-600">
                    <label for="archivo"
                      class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Seleccionar un archivo</span>
                      <input id="archivo" name="archivo" type="file" class="sr-only" @change="handleFileUpload" />
                    </label>
                    <p class="pl-1">o arrastrar y soltar</p>
                  </div>
                  <p class="text-xs text-gray-500">
                    PNG, JPG, GIF hasta 10MB
                  </p>
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button type="button" @click="handleClose"
                class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Cancelar
              </button>
              <button type="submit" :disabled="isSubmitting"
                class="px-4 py-2 text-white bg-blue-700 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50">
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
import { ref, computed, watchEffect, onMounted } from 'vue';
import { useApi } from '@/composables/use-api';
import Swal from 'sweetalert2';
import { Combobox, ComboboxInput, ComboboxButton, ComboboxOptions, ComboboxOption } from '@headlessui/vue';
import { ChevronUpDownIcon } from '@heroicons/vue/20/solid';



interface Props {
  mostrarModal: boolean;
  dependencias: Record<number, string>;
  clientes: Record<number, string>;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'cerrar-modal': [];
  'consultoria-creada': [data: any];
}>();

interface FormData {
  dependenciaId: number | null;
  clienteId: number | null;
  asunto: string; // Nuevo campo
  archivo?: File; // Nuevo campo para el archivo
}

const isSubmitting = ref(false);
const formData = ref<FormData>({
  dependenciaId: null,
  clienteId: null,
  asunto: '', // Inicializar nuevo campo
  archivo: undefined // Inicializar nuevo campo
});

const handleClose = () => {
  emit('cerrar-modal');
};

const handleSubmit = async () => {
  if (isSubmitting.value) return;

  // Validar campos requeridos
  if (!formData.value.dependenciaId) {
    await Swal.fire({
      icon: 'warning',
      title: 'Campo requerido',
      text: 'Por favor, selecciona una dependencia.',
    });
    return;
  }

  if (!formData.value.clienteId) {
    await Swal.fire({
      icon: 'warning',
      title: 'Campo requerido',
      text: 'Por favor, selecciona un cliente.',
    });
    return;
  }

  if (!formData.value.asunto) {
    await Swal.fire({
      icon: 'warning',
      title: 'Campo requerido',
      text: 'Por favor, ingresa un asunto.',
    });
    return;
  }

  try {
    isSubmitting.value = true;
    const formDataToSend = new FormData();
    formDataToSend.append('cdep_id', formData.value.dependenciaId?.toString() || '');
    formDataToSend.append('ccli_id', formData.value.clienteId?.toString() || '');
    
    // Obtener la fecha actual en el formato requerido
    const fechaRegistro = new Date().toISOString(); // Formato "2025-01-07T00:00:00.000Z"
    formDataToSend.append('conr_fecha_registro', fechaRegistro);
    
    formDataToSend.append('conr_asunto', formData.value.asunto);
    if (formData.value.archivo) {
      formDataToSend.append('file', formData.value.archivo);
    }

    const response = await useApi.post('/api/v1/consultoria/consultoria-registro', formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    await Swal.fire({
      icon: 'success',
      title: '¡Consultoría registrada!',
      showConfirmButton: false,
      timer: 2000,
    });

    emit('consultoria-creada', response.data);
    handleClose();
  } catch (error) {
    console.error('Error al registrar consultoría:', error);
    await Swal.fire({
      icon: 'error',
      title: 'Error al registrar consultoría',
      text: 'Por favor, inténtalo de nuevo más tarde.',
    });
  } finally {
    isSubmitting.value = false;
  }
};
//Funciones para drag and drop
const onDragOver = (event: DragEvent) => {
  event.preventDefault();
  event.stopPropagation()
};

const onDragLeave = (event: DragEvent) => {
  event.preventDefault();
  event.stopPropagation()
};

const onDrop = (event: DragEvent) => {
  event.preventDefault();
    event.stopPropagation()
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
        formData.value.archivo = files[0]; // Asignar el primer archivo
    }
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    formData.value.archivo = file;
  }
};

//Función para eliminar el archivo seleccionado
const eliminarArchivo = () => {
    formData.value.archivo = undefined;
};

const getDependenciaName = (id: unknown): string => {
  if (typeof id !== 'number' || !props.dependencias) return '';
  return props.dependencias[id as number] || '';
};

const busqueda = ref('');
const dependenciasFiltered = computed(() => {
  if (!props.dependencias) return {};

  const search = busqueda.value.toLowerCase().trim();
  if (!search) return props.dependencias;

  return Object.fromEntries(
    Object.entries(props.dependencias).filter(([_, nombre]) =>
      nombre.toLowerCase().includes(search)
    )
  );
});

const busquedaCliente = ref('');
const clientesFiltrados = computed(() => {
  const search = busquedaCliente.value.toLowerCase();
  return Object.entries(props.clientes)
    .filter(([_, nombre]) => nombre.toLowerCase().includes(search))
    .reduce((acc, [id, nombre]) => {
      acc[id] = nombre;
      return acc;
    }, {} as Record<number, string>);
});

const fechaActual = computed(() => {
  return new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
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
