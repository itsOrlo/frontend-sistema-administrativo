import { ref, computed, watch, onMounted } from 'vue';
import { useApi } from '@/composables/use-api';
import Swal from 'sweetalert2';

export interface Consultoria {
  ccon_id: number;
  ccon_nombre: string;
  ccon_fecha_registro: string;
  ccon_estado: number;
  [key: string]: string | number;
}

export function useConsultoria(pageSize = 10) {
  const consultorias = ref<Consultoria[]>([]);
  const searchTerm = ref('');
  const currentPage = ref(1);
  const isLoading = ref(false);
  const mostrarModalCrear = ref(false);
  const cabecerasTabla = ref<string[]>([]);
  const dependencias = ref<{ [key: number]: string }>({});

  const consultoriasFiltradas = computed(() => {
    if (!searchTerm.value) return consultorias.value;

    const term = searchTerm.value.toLowerCase();
    return consultorias.value.filter((consultoria) =>
      Object.values(consultoria).join(' ').toLowerCase().includes(term)
    );
  });

  const totalPages = computed(() => Math.ceil(consultoriasFiltradas.value.length / pageSize));

  const consultoriasPaginadas = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize;
    return consultoriasFiltradas.value.slice(startIndex, startIndex + pageSize);
  });

  const loadDependencias = async () => {
    try {
      const response = await useApi.get('/api/v1/consultoria/consultoria-dependencias');
      // Transformar la respuesta en un objeto { id: nombre }
      response.data.forEach((dep: any) => {
        dependencias.value[dep.cdep_id] = dep.cdep_dependencia;
      });
    } catch (error) {
      console.error('Error cargando dependencias:', error);
    }
  };

  const loadConsultorias = async () => {
    try {
      isLoading.value = true;
      const response = await useApi.get('/api/v1/consultoria/consultorias');
      consultorias.value = response.data.sort((a: Consultoria, b: Consultoria) => 
        Number(a.ccon_id) - Number(b.ccon_id)
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

  watch(searchTerm, () => {
    currentPage.value = 1;
  });

  onMounted(async () => {
    await loadConsultorias();
    await loadDependencias();
  });

  return {
    // Estado
    consultorias,
    dependencias,
    searchTerm,
    currentPage,
    isLoading,
    mostrarModalCrear,
    cabecerasTabla,

    // Computed
    consultoriasFiltradas,
    consultoriasPaginadas,
    totalPages,

    // Métodos
    loadConsultorias,
    loadDependencias,

    // Helpers
    setPage: (page: number) => (currentPage.value = page),
    toggleCreateModal: (show: boolean) => (mostrarModalCrear.value = show),
  };
} 