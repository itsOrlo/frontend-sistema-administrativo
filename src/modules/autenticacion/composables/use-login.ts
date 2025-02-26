import { useMutation } from '@tanstack/vue-query';
import type { LoginDto } from '../dto/login.dto';
import type { LoginResponseDto } from '../dto/login-response.dto';
import { useApi } from '@/composables/use-api';
import Swal from 'sweetalert2';
import type { AxiosError } from 'axios';
import { useAutenticacionStore } from '@/stores/use-autenticacion.store';

interface ServerError {
  message: string;
  error?: string;
  statusCode?: number;
}

export const useLogin = () => {
  const autenticacionStore = useAutenticacionStore();

  const mutation = useMutation({
    mutationFn: async (data: LoginDto) => {
      try {
        const response = await useApi.post<LoginResponseDto>('/api/v1/auth/login', {
          username: data.username,
          password: data.password,
        });

        const { usuario, rol, rutas, token, message } = response.data;

        // Si la API devuelve un mensaje de error, mostrar alerta
        if (message) {
          console.error('⚠️ Error en la respuesta del servidor:', message);
          autenticacionStore.onLogginSuccess(false, undefined, undefined, [], message);
          return; // Detener la ejecución
        }

        // Validar si la respuesta de la API tiene todos los campos necesarios
        if (!usuario || !rol || !token || !usuario.usu_nombre) {
          console.error('⚠️ Respuesta del servidor incompleta:', response.data);
          autenticacionStore.onLogginSuccess(false, undefined, undefined, [], 'La respuesta del servidor es incompleta.');
          return; // Detener la ejecución
        }

        // 🔹 Si rutas está undefined, asignar un array vacío
        const rutasFinal = rutas ?? [];

        // Llamar a onLogginSuccess con éxito
        autenticacionStore.onLogginSuccess(true, usuario, rol, rutasFinal, token);

        // Guardar el token y el privilegio en localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('privilege', rol.rol_id.toString());

        return response.data;
      } catch (error) {
        console.error('❌ Error durante la solicitud de login:', error);
        throw error;
      }
    },

    onError: (error) => {
      if ((error as AxiosError).response) {
        const axiosError = error as AxiosError;
        const data = axiosError.response?.data as ServerError;
        const serverMessage = data?.message || 'Ocurrió un error inesperado';

        console.error('❌ Error durante el login:', serverMessage);

        Swal.fire({
          title: 'Error',
          text: serverMessage,
          icon: 'error',
        });
      } else if (error instanceof Error) {
        console.error('❌ Error durante el login:', error.message);

        Swal.fire({
          title: 'Error',
          text: error.message,
          icon: 'error',
        });
      } else {
        console.error('❌ Error inesperado durante el login:', error);

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
