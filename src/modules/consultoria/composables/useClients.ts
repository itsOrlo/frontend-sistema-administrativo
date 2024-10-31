// composables/useClients.ts
import { ref, computed, watch, onMounted } from 'vue';
import { useApi } from '@/composables/use-api';
import Swal from 'sweetalert2';

export interface Cliente {
  Acción: string;
  Empresa: string;
  Ruc: string;
  Contacto: string;
  Correo: string;
  Teléfono: string;
  ctemp_id?: number;
  Accionxd: number;
}

export function useClients(pageSize = 10) {
  const clientes = ref<Cliente[]>([]);
  const searchTerm = ref('');
  const currentPage = ref(1);
  const isLoading = ref(false);
  const mostrarModalCrear = ref(false);

  const mostrarModalEditar = ref(false);
  const clienteSeleccionado = ref<Cliente | null>(null);

  const clientesFiltrados = computed(() => {
    if (!searchTerm.value) return clientes.value;

    const term = searchTerm.value.toLowerCase();
    return clientes.value.filter((cliente) =>
      Object.values(cliente).join(' ').toLowerCase().includes(term),
    );
  });

  const cabecerasTabla = ref<string[]>([]);

  const tiposEmpresa = ref<{ [key: number]: string }>({});

  const totalPages = computed(() => Math.ceil(clientesFiltrados.value.length / pageSize));

  const clientesPaginados = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize;
    return clientesFiltrados.value.slice(startIndex, startIndex + pageSize);
  });

  const loadTiposEmpresa = async () => {
    try {
      const response = await useApi.get('/api/v1/consultoria/empresa-tipo');
      // Transformar la respuesta en un objeto { id: nombre }
      response.data.forEach((tipo) => {
        tiposEmpresa.value[tipo.cempt_id] = tipo.cempt_nombre;
      });
    } catch (error) {
      console.error('Error cargando tipos de empresa:', error);
      // Manejo de errores (opcional): Mostrar una alerta al usuario
    }
  };

  const toggleEditModal = (show: boolean, cliente: Cliente | null = null) => {
    mostrarModalEditar.value = show;
    if (cliente) {
      clienteSeleccionado.value = { ...cliente };
    } else {
      clienteSeleccionado.value = null;
    }
  };

  const loadClients = async () => {
    try {
      isLoading.value = true;
      const response = await useApi.get('/api/v1/consultoria/consultoria-empresa');
      clientes.value = response.data;

      // Obtener las cabeceras del primer objeto
      if (clientes.value.length > 0) {
        cabecerasTabla.value = Object.keys(clientes.value[0]);
      }
    } catch (error) {
      // ... manejo de errores ...
    } finally {
      isLoading.value = false;
    }
  };
  const deleteClient = async (cliente: Cliente) => {
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

    if (!result.isConfirmed) return;

    try {
      const clienteId = parseInt(cliente.Acción);
      if (!clienteId) throw new Error('ID de cliente no válido');

      const response = await useApi.put('/api/v1/consultoria/eliminar-consultoria', {
        ccli_id: clienteId,
      });

      if (response.status === 200) {
        clientes.value = clientes.value.filter((c) => c.Acción !== cliente.Acción);
        await Swal.fire({
          title: '¡Eliminado!',
          text: 'El cliente ha sido eliminado correctamente.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
        await loadClients();
      }
    } catch (error) {
      console.error('Error eliminando cliente:', error);
      await Swal.fire({
        title: 'Error',
        text: 'No se pudo eliminar el cliente. Por favor, inténtalo de nuevo.',
        icon: 'error',
      });
    }
  };

  // Reset página cuando cambia el término de búsqueda
  watch(searchTerm, () => {
    currentPage.value = 1;
  });

  /* Cargar tipo de Empresa */
  onMounted(async () => {
    await loadClients();
    await loadTiposEmpresa();
  });

  return {
    mostrarModalEditar,
    clienteSeleccionado,
    toggleEditModal,

    tiposEmpresa,
    cabecerasTabla,

    // Estado
    clientes,
    searchTerm,
    currentPage,
    isLoading,
    mostrarModalCrear,

    // Computed
    clientesFiltrados,
    clientesPaginados,
    totalPages,

    // Métodos
    loadClients,
    deleteClient,

    // Helpers
    setPage: (page: number) => (currentPage.value = page),
    toggleCreateModal: (show: boolean) => (mostrarModalCrear.value = show),
  };
}
