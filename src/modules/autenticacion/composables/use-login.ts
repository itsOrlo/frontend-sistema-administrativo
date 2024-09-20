import { useMutation } from '@tanstack/vue-query';
import type { LoginDto } from '../dto/login.dto';
import type { LoginResponseDto } from '../dto/login-response.dto';
import { useApi } from '@/composables/use-api';
import Swal from 'sweetalert2';
import type { AxiosError } from 'axios';

interface ServerError {
  message: string;
  error?: string;
  statusCode?: number;
}

export const useLogin = () => {
  const mutation = useMutation({
    mutationFn: async (data: LoginDto) => {
      const response = await useApi.post<LoginResponseDto>('/api/v1/auth/login', {
        username: data.username,
        password: data.password,
      });

      const { usuario, rol, rutas, token, message, statusCode } = response.data;

      
      if (statusCode === 400 && message) {
        throw new Error(message); 
      }

      // Si falta información importante en la respuesta
      if (!usuario || !rol || !rutas || !token) {
        throw new Error('La respuesta del servidor es incompleta.');
      }

      return response.data;
    },

    onError: (error) => {
      // Verificar si el error es de Axios
      if ((error as AxiosError).response) {
        const axiosError = error as AxiosError;
        const data = axiosError.response?.data as ServerError; // Aquí hacemos un type assertion
        const serverMessage = data?.message || 'Ocurrió un error inesperado';

        console.error('Error durante el login:', serverMessage);

        // Mostrar el mensaje de error del servidor en SweetAlert
        Swal.fire({
          title: 'Error',
          text: serverMessage, // Mostramos el mensaje de error personalizado del servidor
          icon: 'error',
        });
      } else if (error instanceof Error) {
        // Si no es un error de Axios, pero es un error genérico
        console.error('Error durante el login:', error.message);

        Swal.fire({
          title: 'Error',
          text: error.message,
          icon: 'error',
        });
      } else {
        // Si es otro tipo de error no esperado
        console.error('Error inesperado durante el login:', error);

        Swal.fire({
          title: 'Error inesperado',
          text: 'Ocurrió un error inesperado, por favor intenta nuevamente.',
          icon: 'error',
        });
      }
    },
  });

  return mutation;
};

