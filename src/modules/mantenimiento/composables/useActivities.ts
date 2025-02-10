import { useApi } from '@/composables/use-api';

interface Activity {
  conr_tramite: string;
  conr_fecha_despacho: string;
  conre_id: number;
  conr_observacion: string;
}

export function useActivities() {
  const createActivity = async (activity: Activity) => {
    try {
      const response = await useApi.post('/api/v1/consultoria/consultoria-registro-tramite-detalle', activity, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al crear actividad:', error);
      throw error;
    }
  };

  const getActivitiesByTramite = async (tramite: string) => {
    try {
      const response = await useApi.get(`/api/v1/consultoria/consultoria-registro-tramite-detalle?conr_tramite=${tramite}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener actividades:', error);
      throw error;
    }
  };

  return {
    createActivity,
    getActivitiesByTramite,
  };
}
