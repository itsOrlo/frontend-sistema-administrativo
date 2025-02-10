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
  const estadosConsultoria = ref<{ conre_id: number; conre_nombre: string }[]>([]);
  const startDate = ref('');
  const endDate = ref('');

  const consultoriasFiltradas = computed(() => {
    let resultado = consultorias.value;
    if (searchTerm.value) {
      const term = searchTerm.value.toLowerCase();
      resultado = resultado.filter((consultoria) =>
        consultoria.Trámite.toLowerCase().includes(term) ||
        consultoria.Dependencia.toLowerCase().includes(term) ||
        consultoria['Empresa cliente'].toLowerCase().includes(term)
      );
    }
    if (filtroEstadoConsultoria.value) {
      resultado = resultado.filter(consultoria => consultoria.Estado === filtroEstadoConsultoria.value);
    }
    if (startDate.value || endDate.value) {
      resultado = resultado.filter(consultoria => {
        const fechaRegistro = new Date(consultoria['Fecha de registro']);
        return (!startDate.value || fechaRegistro >= new Date(startDate.value)) &&
               (!endDate.value || fechaRegistro <= new Date(endDate.value));
      });
    }
    return resultado;
  });

  const cabecerasTabla = ref<string[]>([]);

  const totalPages = computed(() => Math.ceil(consultoriasFiltradas.value.length / pageSize));

  const consultoriasPaginadas = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize;
    return consultoriasFiltradas.value.slice(startIndex, startIndex + pageSize);
  });

  const totalProyectosEnMarcha = computed(() => {
    return consultorias.value.filter(consultoria => consultoria.Estado === 'En marcha').length;
  });

  const totalConsultoriasDelMes = computed(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    return consultorias.value.filter(consultoria => {
      const fechaRegistro = new Date(consultoria['Fecha de registro']);
      return fechaRegistro.getMonth() === currentMonth && fechaRegistro.getFullYear() === currentYear;
    }).length;
  });

  const totalCompletado = computed(() => {
    return consultorias.value.filter(consultoria => consultoria.Estado === 'Completado').length;
  });

  const totalPendiente = computed(() => {
    return consultorias.value.filter(consultoria => consultoria.Estado === 'Pendiente').length;
  });

  const totalCancelado = computed(() => {
    return consultorias.value.filter(consultoria => consultoria.Estado === 'Cancelado').length;
  });

  const totalFinalizado = computed(() => {
    return consultorias.value.filter(consultoria => consultoria.Estado === 'Finalizado').length;
  });

  const totalNoFactible = computed(() => {
    return consultorias.value.filter(consultoria => consultoria.Estado === 'No es factible').length;
  });

  const totalPorDespachar = computed(() => {
    return consultorias.value.filter(consultoria => consultoria.Estado === 'Por despachar').length;
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

  const loadEstadosConsultoria = async () => {
    try {
      const response = await useApi.get('/api/v1/consultoria/consultoria-registro-estado');
      estadosConsultoria.value = response.data;
    } catch (error) {
      console.error('Error cargando estados de consultoría:', error);
    }
  };

  const loadConsultorias = async () => {
    try {
      isLoading.value = true;
      await loadEstadosConsultoria(); // Cargar estados antes de cargar consultorías
      const response = await useApi.get('/api/v1/consultoria/consultoria-registro');
      
      const consultoriasData = response.data.registros; // Ajustar para acceder a la propiedad 'registros'
      const dominio = response.data.dominio.trim(); // Obtener el dominio y eliminar espacios en blanco
      
      if (Array.isArray(consultoriasData)) {
        consultorias.value = consultoriasData.map((consultoria: Consultoria) => {
          if (consultoria.conr_adjunto) {
            consultoria.conr_adjunto = `${dominio}${consultoria.conr_adjunto}`;
          }
          return consultoria;
        }).sort((a: Consultoria, b: Consultoria) => 
          Number(a.conr_id) - Number(b.conr_id)
        );

        if (consultorias.value.length > 0) {
          cabecerasTabla.value = Object.keys(consultorias.value[0]);
        }
      } else {
        throw new Error('La respuesta de la API no es un array');
      }
    } catch (error) {
      console.error('Error cargando consultorías:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const loadConsultoriasPorTramite = async (conr_tramite: string) => {
    try {
      const response = await useApi.get(`/api/v1/consultoria/consultoria-registro-tramite?conr_tramite=${conr_tramite}`);
      console.log('Respuesta de la API (Trámite):', response.data);
      return response.data;
    } catch (error) {
      console.error('Error cargando consultorías por trámite:', error);
      return [];
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
    XLSX.writeFile(wb, 'bdd_consultorias.xlsx');
  };

  const handleConsultoriaCreada = async () => {
    await loadConsultorias();
    window.location.reload(); // Recargar la página
  };

  const editarConsultoria = async (tramite: string) => {
    try {
      const response = await useApi.get(`/api/v1/consultoria/consultoria-registro-tramite?conr_tramite=${tramite}`);
      console.log('Respuesta de la API (Trámite):', response.data);
      const consultoria = response.data[0]; // Asegurarse de obtener el primer objeto del array
      if (consultoria) {
        console.log('Consultoria seleccionada:', consultoria);
        consultoriaSeleccionada.value = consultoria;
        toggleEditModal(true, consultoria);
      } else {
        console.error("Error: No se encontró la consultoría con el trámite especificado.");
      }
    } catch (error) {
      console.error('Error al cargar la consultoría:', error);
    }
  };

  watch(searchTerm, () => {
    currentPage.value = 1;
  });

  onMounted(async () => {
    await loadConsultorias();
    await loadConsultoriasPorTramite('AA0009'); // Probar con el valor "AA0009"
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
    estadosConsultoria, // Añadir estadosConsultoria al return
    exportarTodasConsultorias,
    totalProyectosEnMarcha,
    totalFinalizado,
    totalNoFactible,
    totalPorDespachar,
    totalCompletado,
    totalPendiente,
    totalCancelado,
    totalConsultoriasDelMes,
    handleConsultoriaCreada,
    loadConsultoriasPorTramite, // Añadir la nueva función al return
    editarConsultoria,
    startDate,
    endDate,
  };
}