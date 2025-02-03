import { defineStore } from 'pinia';
import { ref, onMounted } from 'vue';
import type { RutaDto } from '@/modules/autenticacion/dto/login-response.dto';

export const useAutenticacionStore = defineStore('autenticacion', () => {
  const privilegio = ref(0); // Privilegio

  const loginStatus = ref(false);
  const nombre = ref('');

  const rolId = ref(-1);
  const rutas = ref<RutaDto[]>([]);
  const token = ref('');

  const showModal = ref(false);
  const messageError = ref('');
  const titleError = ref('');

  onMounted(() => {
    const storedPrivilegio = localStorage.getItem('privilegio');
    if (storedPrivilegio) {
      privilegio.value = parseInt(storedPrivilegio, 10);
    }

    const storedNombreUsuario = localStorage.getItem('usuario');
    if (storedNombreUsuario) {
      nombre.value = storedNombreUsuario;
    }
  });

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

      if (rutasParam) {
        rutas.value = rutasParam;
        // Obtener el privilegio (adaptar la lógica según tu API)
        const privilegioValor = rutasParam.some((ruta) => ruta.roru_privilegio === 1) ? 1 : 0;
        privilegio.value = privilegioValor; // Guardar el privilegio en el store
      } else {
        // Manejar el caso en que rutasParam sea undefined
        console.error('rutasParam es undefined');
        // Puedes asignar un valor por defecto a rutas.value, por ejemplo:
        rutas.value = [];
      }

      console.log('Privilegio actualizado:', privilegio.value); // Agregar este console.log
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
    localStorage.removeItem('rutas');
  };

  const updateRutas = (rutasParam: any) => {
    rutas.value = rutasParam;
  };

  return {
    // state
    loginStatus,
    nombre,
    privilegio,
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
