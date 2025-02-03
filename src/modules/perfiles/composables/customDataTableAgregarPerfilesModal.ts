import { useMutation } from '@tanstack/vue-query';
import { useApi } from '@/composables/use-api';
import Swal from 'sweetalert2';
import type { AxiosError } from 'axios';
import type { PerfilDto } from '../dto/Perfil.dto';
import type { ServerError } from '../dto/serverError.dto';


export const useGuardarPerfil = () => {
  const mutation = useMutation({
    mutationFn: async (data: PerfilDto) => {
      const response = await useApi.post('/api/v1/perfiles', {
        perf_nombre: data.perf_nombre,
        perf_nivel_contribucion: data.perf_nivel_contribucion,
        usu_id: data.usu_id, 
      });

      const { message, statusCode } = response.data;

      if (statusCode && statusCode !== 201) {
        throw new Error(message || 'Error al crear el perfil');
      }

      return response.data;
    },
    onError: (error: AxiosError) => {
      const data = error.response?.data as ServerError;
      const serverMessage = data?.message || 'Ocurrió un error inesperado';

      Swal.fire({
        title: 'Error',
        text: serverMessage,
        icon: 'error',
      });
    },
  });

  return mutation;
};
