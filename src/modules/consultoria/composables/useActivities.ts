import { useApi } from '@/composables/use-api';

interface Activity {
  conr_tramite: string;
  conr_fecha_despacho: string;
  conre_id: number;
  conr_observacion: string;
  file?: File;
}

export function useActivities() {
  const createActivity = async (activity: Activity) => {
    try {
      const formData = new FormData();
      formData.append('conr_tramite', activity.conr_tramite);
      formData.append('conr_fecha_despacho', activity.conr_fecha_despacho);
      formData.append('conre_id', activity.conre_id.toString());
      formData.append('conr_observacion', activity.conr_observacion);
      if (activity.file) {
        formData.append('file', activity.file);
      }

      const response = await useApi.post('/api/v1/consultoria/consultoria-registro-tramite-detalle', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
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
      return response.data.registros;
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
