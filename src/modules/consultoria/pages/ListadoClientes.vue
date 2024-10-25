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

      <!-- Tabla de Clientes Component -->
      <ClienteTable
        :clientes="clientesPaginados"
        :current-page="currentPage"
        :total-pages="totalPages"
        @editar="editarCliente"
        @eliminar="confirmarEliminarCliente"
        @cambiar-pagina="cambiarPagina"
      />
    </div>
    <CrearCliente v-if="mostrarModalCrear" @cerrarModal="cerrarModalCrearCliente" />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue';
import { useApi } from '@/composables/use-api';
import DashboardLayout from '@/modules/dashboard/layouts/DashboardLayout.vue';
import ClienteTable from '../components/ClienteTable.vue';
import CrearCliente from '../components/CrearCliente.vue';
import Swal from 'sweetalert2';

const clientes = ref([]);
const searchTerm = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const mostrarModalCrear = ref(false);

const abrirModalCrearCliente = () => {
  mostrarModalCrear.value = true;
};

const cerrarModalCrearCliente = () => {
  mostrarModalCrear.value = false;
};

const cambiarPagina = (nuevaPagina) => {
  currentPage.value = nuevaPagina;
};

const confirmarEliminarCliente = async (cliente) => {
  try {
    console.log('Cliente a eliminar:', cliente);

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      html: `
        <p>¿Deseas eliminar el cliente <strong>${cliente.Empresa}</strong>?</p>
        <p class="mt-2 text-sm text-gray-500">Esta acción no se puede deshacer.</p>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      await eliminarCliente(cliente);
    }
  } catch (error) {
    console.error('Error al mostrar el modal de confirmación:', error);
  }
};

const eliminarCliente = async (cliente) => {
  try {
    const clienteId = parseInt(cliente.Acción);

    if (!clienteId) {
      console.error('ID de cliente no válido:', cliente);
      throw new Error('ID de cliente no válido');
    }

    const requestBody = {
      ccli_id: clienteId,
    };

    console.log('Request body:', requestBody);

    const response = await useApi.put('/api/v1/consultoria/eliminar-consultoria', requestBody);

    console.log('Respuesta del servidor:', response);

    if (response.status === 200) {
      clientes.value = clientes.value.filter((c) => c.Acción !== clienteId);

      await Swal.fire({
        title: '¡Eliminado!',
        text: 'El cliente ha sido eliminado correctamente.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });

      const refreshResponse = await useApi.get('/api/v1/consultoria/consultoria-empresa');
      clientes.value = refreshResponse.data;
    }
  } catch (error) {
    console.error('Error al eliminar el cliente:', error);
    await Swal.fire({
      title: 'Error',
      text: 'No se pudo eliminar el cliente. Por favor, inténtalo de nuevo.',
      icon: 'error',
    });
  }
};

const editarCliente = (id) => {
  console.log('Editar cliente con ID:', id);
};

/* Filtro de búsqueda */
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
      cliente.Teléfono.toLowerCase().includes(term)
    );
  });
});

const totalPages = computed(() => Math.ceil(clientesFiltrados.value.length / pageSize.value));

const clientesPaginados = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return clientesFiltrados.value.slice(startIndex, endIndex);
});

watch(searchTerm, () => {
  currentPage.value = 1;
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
      text: 'No se pudo cargar la lista de clientes.',
    });
  }
});
</script>
