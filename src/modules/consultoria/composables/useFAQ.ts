import { ref } from 'vue';
import { useApi } from '@/composables/use-api';

interface FAQ {
  conf_titulo: string;
  conf_detalle: string;
  conf_video: string | null;
}

export function useFAQ() {
  const faqs = ref<FAQ[]>([]);
  const loading = ref(false);
  const error = ref<unknown>(null);

  const fetchFAQs = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await useApi.get('/api/v1/consultoria/consultoria-faq');
      faqs.value = response.data.registros;
    } catch (err) {
      error.value = err;
      console.error('Error al obtener FAQs:', err);
    } finally {
      loading.value = false;
    }
  };

  return {
    faqs,
    loading,
    error,
    fetchFAQs,
  };
}
