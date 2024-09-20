import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { RutaDto } from '@/modules/autenticacion/dto/login-response.dto';

export const useAutenticacionStore = defineStore('autenticacion', () => {
  const loginStatus = ref(false);
  const nombre = ref('');
  const rolId = ref(-1);
  const rutas = ref<RutaDto[]>([]);
  const token = ref('');

  const showModal = ref(false);
  const messageError = ref('');
  const titleError = ref('');

  const onLogginSuccess = (
    success: boolean,
    nombreParam?: string,
    rolIdParam?: number,
    message?: string,
    rutasParam?: any[],
    tokenParam?: string,
  ) => {
    if (success === true) {
      loginStatus.value = true;
      nombre.value = nombreParam ? nombreParam : '';
      rolId.value = rolIdParam ? rolIdParam : -1;
      messageError.value = '';
      titleError.value = '';
      showModal.value = false;

      console.log('Rutas asignadas al store:', rutas.value); // Debugging
      console.log('Rutas desde el API:', rutasParam);
      console.log('Estado del store después de asignar rutas:', rutas.value);

      rutas.value = rutasParam || [];
      token.value = tokenParam || '';
    } else {
      showModal.value = true;
      messageError.value = message ?? '-';
      titleError.value = 'Error';
      loginStatus.value = false;
    }
  };

  const onLogginError = (error?: string) => {
    showModal.value = true;
    messageError.value = error ? error : 'Error al iniciar sesión';
    titleError.value = 'Error';
    loginStatus.value = false;
  };

  const closeModal = () => {
    showModal.value = false;
  };

  const onLogout = () => {
    loginStatus.value = false;
    nombre.value = '';
    rolId.value = -1;
    rutas.value = [];
    token.value = '';

    localStorage.removeItem('usuarioId');
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
  };

  const updateRutas = (rutasParam: any) => {
    rutas.value = rutasParam;
  };

  return {
    // state
    loginStatus,
    nombre,
    rolId,
    rutas,
    token,
    showModal,
    messageError,
    titleError,
    // actions
    onLogginSuccess,
    onLogginError,
    closeModal,
    onLogout,
    updateRutas,
  };
});
