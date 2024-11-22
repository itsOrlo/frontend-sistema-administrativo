// composables/useClients.ts
import { ref, computed, watch, onMounted } from 'vue';
import { useApi } from '@/composables/use-api';
import Swal from 'sweetalert2';

export interface Dependencia {
  cdep_id: number;
  cdep_dependencia: string;
  cdep_fecha_registro: string;
  cdep_estado: number;
  [key: string]: string | number;
}

export function useDependencia(pageSize = 10) {
  const dependencias = ref<Dependencia[]>([]);
  const searchTerm = ref('');
  const currentPage = ref(1);
  const isLoading = ref(false);
  const mostrarModalCrear = ref(false);

  const mostrarModalEditar = ref(false);
  const dependenciaSeleccionado = ref<Dependencia | null>(null);

  const dependenciasFiltrados = computed(() => {
    if (!searchTerm.value) return dependencias.value;

    const term = searchTerm.value.toLowerCase();
    return dependencias.value.filter((dependencia) =>
      Object.values(dependencia).join(' ').toLowerCase().includes(term),
    );
  });

  const cabecerasTabla = ref<string[]>([]);


  const totalPages = computed(() => Math.ceil(dependenciasFiltrados.value.length / pageSize));

  const dependenciasPaginados = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize;
    return dependenciasFiltrados.value.slice(startIndex, startIndex + pageSize);
  });

  const toggleEditModal = (show: boolean, dependencia: Dependencia | null = null) => {
    mostrarModalEditar.value = show;
    if (show) { // Si el modal se va a mostrar
      if (dependencia) {
        dependenciaSeleccionado.value = { ...dependencia };
      } else {
        // Manejar el caso en que 'dependencia' sea null, por ejemplo:
        console.error("Error: Se esperaba un objeto Cliente.");
        dependenciaSeleccionado.value = null; // O asignar un valor por defecto
      }
    } else {
      dependenciaSeleccionado.value = null; // Asignar null al cerrar el modal
    }
  };

  const loadDepends = async () => {
    try {
      isLoading.value = true;
      const response = await useApi.get('/api/v1/consultoria/consultoria-dependencias');
      
      // Ordenamos los datos antes de asignarlos
      dependencias.value = response.data.sort((a: Dependencia, b: Dependencia) => {
        // Convertimos explícitamente a números y ordenamos
        return Number(a.cdep_id) - Number(b.cdep_id);
      });

      // Obtener las cabeceras del primer objeto
      if (dependencias.value.length > 0) {
        cabecerasTabla.value = Object.keys(dependencias.value[0]);
      }
    } catch (error) {
      console.error('Error cargando dependencias:', error);
      // ... manejo de errores ...
    } finally {
      isLoading.value = false;
    }
  };
  const deleteDepend = async (dependencia: Dependencia) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      html: `
        <p>¿Deseas eliminar la dependencia <strong>${dependencia.cdep_dependencia}</strong>?</p>
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
      const dependenciaId = dependencia.cdep_id;
      if (!dependenciaId) throw new Error('ID de dependencoa no válido');

      const response = await useApi.put('/api/v1/consultoria/eliminar-consultoria', {
        ccdep_id: dependenciaId,
      });

      if (response.status === 200) {
        dependencias.value = dependencias.value.filter((c) => c.cdep_id !== dependencia.cdep_id);
        await Swal.fire({
          title: '¡Eliminado!',
          text: 'La dependencia ha sido eliminado correctamente.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
        await loadDepends();
      }
    } catch (error) {
      console.error('Error eliminando dependencia:', error);
      await Swal.fire({
        title: 'Error',
        text: 'No se pudo eliminar la dependencia. Por favor, inténtalo de nuevo.',
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
    await loadDepends();
  });

  return {
    mostrarModalEditar,
    dependenciaSeleccionado,
    toggleEditModal,

    cabecerasTabla,

    // Estado
    dependencias,
    searchTerm,
    currentPage,
    isLoading,
    mostrarModalCrear,

    // Computed
    dependenciasFiltrados,
    dependenciasPaginados,
    totalPages,

    // Métodos
    loadDepends,
    deleteDepend,

    // Helpers
    setPage: (page: number) => (currentPage.value = page),
    toggleCreateModal: (show: boolean) => (mostrarModalCrear.value = show),
  };
}
