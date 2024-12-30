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
            <h2 class="text-lg font-bold text-white">Registrar Nueva Consultoría</h2>
            <button
              @click="handleClose"
              class="text-white hover:text-gray-200 focus:outline-none"
              aria-label="Cerrar modal"
            >
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
                        :displayValue="(id) => getDependenciaName(id)"
                        @change="busqueda = $event.target.value"
                        placeholder="Buscar dependencia..."
                      />
                      <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </ComboboxButton>
                    </div>
                    <ComboboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      <ComboboxOption
                        v-for="(nombre, id) in dependenciasFiltered"
                        :key="id"
                        :value="Number(id)"
                        v-slot="{ selected, active }"
                      >
                        <li
                          class="relative cursor-default select-none py-2 pl-3 pr-9"
                          :class="{
                            'bg-blue-600 text-white': active,
                            'text-gray-900': !active
                          }"
                        >
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
                        @change="busquedaCliente = $event.target.value"
                        placeholder="Buscar cliente..."
                      />
                      <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </ComboboxButton>
                    </div>
                    <ComboboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      <ComboboxOption
                        v-for="(nombre, id) in clientesFiltrados"
                        :key="id"
                        :value="id"
                        v-slot="{ selected, active }"
                      >
                        <li
                          class="relative cursor-default select-none py-2 pl-3 pr-9"
                          :class="{
                            'bg-blue-600 text-white': active,
                            'text-gray-900': !active
                          }"
                        >
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
                  <input
                    type="text"
                    :value="fechaActual"
                    disabled
                    class="w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 text-sm text-gray-700"
                  />
                </div>
              </div>
            </div>

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
import { ref, computed, watchEffect } from 'vue';
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
}

const isSubmitting = ref(false);
const formData = ref<FormData>({
  dependenciaId: null,
  clienteId: null
});

const handleClose = () => {
  emit('cerrar-modal');
};

const handleSubmit = async () => {
  if (isSubmitting.value) return;

  try {
    isSubmitting.value = true;
    const datosRegistro = {
      dependenciaId: formData.value.dependenciaId,
      clienteId: formData.value.clienteId
    };

    const response = await useApi.post('/api/v1/consultoria/consultoria', datosRegistro);

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

// Para depuración
watchEffect(() => {
  console.log('Valor actual de dependenciaId:', formData.value.dependenciaId);
  console.log('Dependencias disponibles:', props.dependencias);
  console.log('Dependencias filtradas:', dependenciasFiltered.value);
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
