import { defineStore } from 'pinia';
import { ref, onMounted } from 'vue';
import type { RutaInterface } from 'src/modules/dashboard/dto/menu-rutas-response.dto';
import { useRouter } from 'vue-router';
import { fetchRoutes, removeRoutesOnLogout } from '@/utils/route-utils';

export const useAutenticacionStore = defineStore('autenticacion', () => {
  const privilegio = ref(0);
  const loginStatus = ref(false);
  const nombre = ref('');
  const rolId = ref(-1);
  const rutas = ref<RutaInterface[]>([]);
  const token = ref('');
  
  const showModal = ref(false);
  const messageError = ref('');
  const titleError = ref('');

  const router = useRouter();

  onMounted(() => {
    console.log("🔄 Restaurando autenticación desde localStorage...");

    const storedPrivilegio = localStorage.getItem('privilegio');
    if (storedPrivilegio) {
      privilegio.value = parseInt(storedPrivilegio, 10);
    }

    const storedNombreUsuario = localStorage.getItem('usuario');
    if (storedNombreUsuario) {
      nombre.value = storedNombreUsuario;
    }

    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      token.value = storedToken;
    }

    // 🔹 Restaurar rolId desde localStorage
    const storedRolId = localStorage.getItem('rolId');
    if (storedRolId) {
      rolId.value = parseInt(storedRolId, 10);
    }

    // 🔹 Restaurar rutas desde localStorage y agregarlas a Vue Router
    const storedRutas = localStorage.getItem('rutas');
    if (storedRutas) {
      rutas.value = JSON.parse(storedRutas);
      console.log("✅ Rutas restauradas desde localStorage:", rutas.value);

      // 🔹 Registrar rutas en Vue Router
      if (rutas.value.length > 0) {
        fetchRoutes(router, rutas.value);
      }
    }
  });

  const onLogginSuccess = (
    success: boolean,
    usuario?: { usu_nombre: string },
    rol?: { rol_id: number },
    rutasParam: RutaInterface[] = [],
    tokenParam?: string
  ) => {
    if (!rutasParam) {
      console.error("⚠️ rutasParam es undefined en onLogginSuccess");
      rutasParam = [];
    }
  
    if (success) {
      loginStatus.value = true;
      nombre.value = usuario?.usu_nombre || '';
      rolId.value = rol?.rol_id || -1;
      localStorage.setItem('rolId', rolId.value.toString());
      messageError.value = '';
      titleError.value = '';
      showModal.value = false;
  
      rutas.value = rutasParam;
      privilegio.value = rutasParam.some(ruta => ruta.roru_privilegio === 1) ? 1 : 0;
      localStorage.setItem('privilegio', privilegio.value.toString());
  
      if (tokenParam) {
        token.value = tokenParam;
        localStorage.setItem('token', tokenParam);
      }
  
      // 🔹 Guardar rutas en `localStorage` para persistencia
      localStorage.setItem('rutas', JSON.stringify(rutasParam));

      // 🔹 Registrar rutas dinámicas en Vue Router
      fetchRoutes(router, rutasParam);

      console.log('✅ Privilegio actualizado:', privilegio.value);
    } else {
      showModal.value = true;
      messageError.value = 'Error en la autenticación';
      titleError.value = 'Error';
      loginStatus.value = false;
    }
  };

  const onLogginError = (error?: string) => {
    showModal.value = true;
    messageError.value = error || 'Error al iniciar sesión';
    titleError.value = 'Error';
    loginStatus.value = false;
  };

  const closeModal = () => {
    showModal.value = false;
  };

  const onLogout = () => {
    console.log("🔴 Cerrando sesión...");

    loginStatus.value = false;
    nombre.value = '';
    rolId.value = -1;
    rutas.value = [];
    token.value = '';

    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    localStorage.removeItem('rutas');
    localStorage.removeItem('privilegio');
    localStorage.removeItem('rolId');

    // 🔹 Eliminar rutas de Vue Router dinámicamente
    removeRoutesOnLogout(router);
    
    // Redirigir a la pantalla de login
    router.replace({ name: 'login' });
  };

  const updateRutas = (rutasParam: RutaInterface[]) => {
    rutas.value = rutasParam;
    localStorage.setItem('rutas', JSON.stringify(rutasParam));
    fetchRoutes(router, rutasParam);
  };

  return {
    loginStatus,
    nombre,
    privilegio,
    rolId,
    rutas,
    token,
    showModal,
    messageError,
    titleError,
    onLogginSuccess,
    onLogginError,
    closeModal,
    onLogout,
    updateRutas,
  };
});
