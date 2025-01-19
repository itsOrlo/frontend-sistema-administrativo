import { ref, computed, watch, onMounted } from 'vue';
import { useApi } from '@/composables/use-api';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

export interface Consultoria {
  Trámite: string;
  Dependencia: string;
  'Empresa cliente': string;
  'Fecha de registro': string;
  'Fecha de despacho': string | null;
  Asunto: string;
  conr_adjunto: string | null;
  Estado: string;
  Observación: string | null;
  conr_id: number;
  [key: string]: string | number | null;
}

export function useConsultoria(pageSize = 10) {
  const consultorias = ref<Consultoria[]>([]);
  const searchTerm = ref('');
  const currentPage = ref(1);
  const isLoading = ref(false);
  const mostrarModalCrear = ref(false);
  const mostrarModalEditar = ref(false);
  const consultoriaSeleccionada = ref<Consultoria | null>(null);
  const filtroEstadoConsultoria = ref('');

  const consultoriasFiltradas = computed(() => {
    let resultado = consultorias.value;
    if (searchTerm.value) {
      const term = searchTerm.value.toLowerCase();
      resultado = resultado.filter((consultoria) =>
        Object.values(consultoria).join(' ').toLowerCase().includes(term)
      );
    }
    if (filtroEstadoConsultoria.value) {
      resultado = resultado.filter(consultoria => consultoria.Estado === filtroEstadoConsultoria.value);
    }
    return resultado;
  });

  const cabecerasTabla = ref<string[]>([]);

  const totalPages = computed(() => Math.ceil(consultoriasFiltradas.value.length / pageSize));

  const consultoriasPaginadas = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize;
    return consultoriasFiltradas.value.slice(startIndex, startIndex + pageSize);
  });

  const toggleEditModal = (show: boolean, consultoria: Consultoria | null = null) => {
    mostrarModalEditar.value = show;
    if (show) {
      if (consultoria) {
        consultoriaSeleccionada.value = { ...consultoria };
      } else {
        console.error("Error: Se esperaba un objeto Consultoria.");
        consultoriaSeleccionada.value = null;
      }
    } else {
      consultoriaSeleccionada.value = null;
    }
  };

  const loadConsultorias = async () => {
    try {
      isLoading.value = true;
      const response = await useApi.get('/api/v1/consultoria/consultoria-registro');
      consultorias.value = response.data.sort((a: Consultoria, b: Consultoria) => 
        Number(a.conr_id) - Number(b.conr_id)
      );

      if (consultorias.value.length > 0) {
        cabecerasTabla.value = Object.keys(consultorias.value[0]);
      }
    } catch (error) {
      console.error('Error cargando consultorías:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const deleteConsultoria = async (consultoria: Consultoria) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      html: `
        <p>¿Deseas eliminar la consultoría <strong>${consultoria.Trámite}</strong>?</p>
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
      const consultoriaId = consultoria.conr_id;
      if (!consultoriaId) throw new Error('ID de consultoría no válido');

      const response = await useApi.put('/api/v1/consultoria/eliminar-consultoria', {
        conr_id: consultoriaId,
      });

      if (response.status === 200) {
        consultorias.value = consultorias.value.filter((c) => c.conr_id !== consultoria.conr_id);
        await Swal.fire({
          title: '¡Eliminado!',
          text: 'La consultoría ha sido eliminada correctamente.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
        await loadConsultorias();
      }
    } catch (error) {
      console.error('Error eliminando consultoría:', error);
      await Swal.fire({
        title: 'Error',
        text: 'No se pudo eliminar la consultoría. Por favor, inténtalo de nuevo.',
        icon: 'error',
      });
    }
  };

  const exportarTodasConsultorias = () => {
    const datosParaExportar = consultoriasFiltradas.value.map((consultoria) => {
      const {
        Trámite,
        Dependencia,
        'Empresa cliente': EmpresaCliente,
        'Fecha de registro': FechaRegistro,
        'Fecha de despacho': FechaDespacho,
        Asunto,
        conr_adjunto,
        Estado,
      } = consultoria;
      return {
        Trámite,
        Dependencia,
        'Empresa cliente': EmpresaCliente,
        'Fecha de registro': FechaRegistro,
        'Fecha de despacho': FechaDespacho,
        Asunto,
        Archivo: conr_adjunto ? 'Disponible' : 'No disponible',
        Estado,
      };
    });

    const ws = XLSX.utils.json_to_sheet(datosParaExportar);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Consultorias');
    XLSX.writeFile(wb, 'consultorias.xlsx');
  };

  watch(searchTerm, () => {
    currentPage.value = 1;
  });

  onMounted(async () => {
    await loadConsultorias();
  });

  return {
    mostrarModalEditar,
    consultoriaSeleccionada,
    toggleEditModal,
    cabecerasTabla,
    consultorias,
    searchTerm,
    currentPage,
    isLoading,
    mostrarModalCrear,
    consultoriasFiltradas,
    consultoriasPaginadas,
    totalPages,
    loadConsultorias,
    deleteConsultoria,
    setPage: (page: number) => (currentPage.value = page),
    toggleCreateModal: (show: boolean) => (mostrarModalCrear.value = show),
    filtroEstadoConsultoria,
    exportarTodasConsultorias,
  };
}