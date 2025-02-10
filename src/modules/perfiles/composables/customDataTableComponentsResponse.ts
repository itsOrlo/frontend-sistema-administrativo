import { useMutation } from '@tanstack/vue-query';
import { useApi } from '@/composables/use-api';
import Swal from 'sweetalert2';
import type { AxiosError } from 'axios';
import type { ServerError } from '../dto/serverError.dto';
import type { ItemCatalogo } from '../dto/itemCatalogo.dto';



export const useConsultarItemCatalogo = () => {
  const mutation = useMutation({
    mutationFn: async (catalogoId: string) => {
      // Consulta dinámica pasando el ID del catálogo
      const response = await useApi.get<ItemCatalogo[]>(`/api/v1/item-catalogo/${catalogoId}`);

      return response.data;
    },
    onError: (error: AxiosError) => {
      const data = error.response?.data as ServerError;
      const serverMessage = data?.message || 'Ocurrió un error inesperado';

      // Muestra el error usando SweetAlert
      Swal.fire({
        title: 'Error',
        text: serverMessage,
        icon: 'error',
      });
    },
  });

  return mutation;
};
