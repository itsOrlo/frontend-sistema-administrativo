<template>
  <DashboardLayout>
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-4">Clientes</h2>
      <div class="flex justify-end mb-4">
        <button
          @click="abrirModalCrearCliente"
          class="bg-blue-800 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
        >
          + Nuevo Cliente
        </button>

      </div>
      <!-- Elemento Búsqueda -->
      <input
        type="text"
        v-model="searchTerm"
        placeholder="Buscar..."
        class="mb-4 p-2 border rounded"
      />

      <!-- Start Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Empresa
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                RUC
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Contacto
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Correo
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Teléfono
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tipo de empresa
              </th>

              <!-- ID -->
              <!-- <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Acción
              </th> -->
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="cliente in clientesPaginados" :key="cliente.Ruc">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ cliente.Empresa }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ cliente.Ruc }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ cliente.Contacto }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ cliente.Correo }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ cliente.Teléfono }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ obtenerNombreTipoEmpresa(cliente['Tipo de empresa']) }}
              </td>

              <!-- ID -->
              <!-- <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ (cliente.Acción) }}
              </td> -->

              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button
                  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                  @click="editarCliente(cliente.Ruc)"
                >
                  Editar
                </button>
                <button
                  class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  @click="eliminarCliente(cliente.Ruc)"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- End Table -->

      <!-- Start  Pagination -->
      <div class="mt-4">
        <button @click="currentPage--" :disabled="currentPage === 1">Anterior</button>
        <span>{{ currentPage }} de {{ totalPages }}</span>
        <button @click="currentPage++" :disabled="currentPage === totalPages">Siguiente</button>
      </div>
      <!-- End Pagination -->
    </div>
    <CrearCliente 
    v-if="mostrarModalCrear" 
    @cerrarModal="cerrarModalCrearCliente"
  />
  </DashboardLayout>
</template>
<!-- Start Script -->
<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue';
import { useApi } from '@/composables/use-api';
import DashboardLayout from '@/modules/dashboard/layouts/DashboardLayout.vue';
import Swal from 'sweetalert2';
import CrearCliente from '../components/CrearCliente.vue';

const mostrarModalCrear = ref(false);

const abrirModalCrearCliente = () => {
  mostrarModalCrear.value = true;
};

const cerrarModalCrearCliente = () => {
  mostrarModalCrear.value = false;
};

const crearCliente = async (nuevoCliente) => {
  try {
    await useApi.post('/api/v1/consultoria/consultoria-empresa', nuevoCliente);

    // Mostrar mensaje de éxito y cerrar el modal
    Swal.fire({
      icon: 'success',
      title: '¡Cliente registrado!',
      showConfirmButton: false,
      timer: 3000,
    });

    // Recargar la lista de clientes después de crear uno nuevo
    onMounted(); 

    cerrarModalCrearCliente();
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: 'error',
      title: 'Error al registrar el cliente',
      text: 'Por favor, inténtalo de nuevo más tarde.',
    });
  }
};

const clientes = ref([]);
const searchTerm = ref('');
const currentPage = ref(1);
const pageSize = ref(10); // Número de elementos por página

// Obtener los nombres de tipo de empresa
const obtenerNombreTipoEmpresa = (tipoId) => {
  const tiposEmpresa = {
    1: 'Tipo 1',
    2: 'Tipo 2',
    // ...
  };
  return tiposEmpresa[tipoId] || 'Desconocido';
};


const editarCliente = (id) => {
  // Redirigir a la página de edición con el ID del cliente
  // Por ejemplo: this.$router.push(`/clientes/${id}/editar`);
  console.log('Editar cliente con ID:', id);
};

const eliminarCliente = (id) => {
  // Mostrar una confirmación y eliminar el cliente con el ID
  if (confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
    // Llamar a la API para eliminar el cliente
    // Por ejemplo: useApi.delete(`/clientes/${id}`)
    console.log('Eliminar cliente con ID:', id);
  }
};

/* Start Filtro  de búsqueda */
const clientesFiltrados = computed(() => {
  if (!searchTerm.value) {
    return clientes.value;
  }
  const term = searchTerm.value.toLowerCase();
  return clientes.value.filter((cliente) => {
    return (
      cliente.Empresa.toLowerCase().includes(term) ||
      cliente.Ruc.toLowerCase().includes(term) ||
      cliente.Contacto.toLowerCase().includes(term) ||
      cliente.Correo.toLowerCase().includes(term) ||
      cliente.Teléfono.toLowerCase().includes(term) ||
      obtenerNombreTipoEmpresa(cliente['Tipo de empresa']).toLowerCase().includes(term)
    );
  });
});
/* End Filtro de búsqueda */

const totalPages = computed(() => Math.ceil(clientesFiltrados.value.length / pageSize.value));

const clientesPaginados = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return clientesFiltrados.value.slice(startIndex, endIndex);
});

watch(currentPage, () => {});

watch(searchTerm, () => {
  currentPage.value = 1; // Reiniciar la página al cambiar el término de búsqueda
});

onMounted(async () => {
  try {
    const response = await useApi.get('/api/v1/consultoria/consultoria-empresa');
    clientes.value = response.data;
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo cargar la lista de clientes.'
    });
  }
});
</script>
<!-- End Script -->
