<template>
  <LoginLayout>
    <div class="flex items-center justify-center min-h-screen">
      <div class="bg-white/80 p-8 rounded-xl shadow-2xl max-w-md w-full backdrop-blur-xl">
        <h2 class="text-3xl font-bold mb-8 text-gray-800 text-center">Bienvenido</h2>
        <form @submit.prevent="submit" class="space-y-6">
          <div>
            <label for="username" class="block text-gray-800 text-sm font-semibold mb-2">
              Nombre de Usuario
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
              <input
                v-model="username"
                type="text"
                id="username"
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Ingresa tu usuario"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-gray-800 text-sm font-semibold mb-2">
              Contraseña
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
              <input
                v-model="password"
                type="password"
                id="password"
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Ingresa tu contraseña"
              />
            </div>
          </div>

          <button
            type="submit"
            :class="[
              query.isPending.value
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700',
              'w-full py-3 px-4 rounded-lg text-white font-semibold transition duration-200 transform hover:scale-[1.02]',
            ]"
            :disabled="query.isPending.value"
          >
            {{ query.isPending.value ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>
        </form>
      </div>
    </div>
  </LoginLayout>
  <div
    v-if="store.showModal"
    class="fixed z-10 inset-0 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
      ></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"
        >&#8203;</span
      >
      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div
              class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
            >
              <svg
                class="h-6 w-6 text-red-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                {{ store.titleError }}
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  {{ store.messageError }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            @click="closeModal"
            type="button"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LoginLayout from '../layouts/LoginLayout.vue';
import { useAutenticacionStore } from '@/stores/use-autenticacion.store';
import { useLogin } from '../composables/use-login';
import { useRouter } from 'vue-router';
import type { LoginResponseDto } from '../dto/login-response.dto';
import { fetchRoutes } from '@/utils/route-utils';

const query = useLogin();
const username = ref<string>('');
const password = ref<string>('');
const router = useRouter();
const store = useAutenticacionStore();

const submit = async () => {
  try {
    const response = await query.mutateAsync({
      username: username.value,
      password: password.value,
    });

    if (response) {
      const { usuario, rol, rutas, token }: LoginResponseDto = response;

      // Actualizar el store con los datos del login, incluyendo el privilegio
      store.onLogginSuccess(true, usuario.usu_nombre, rol.rol_id, 'Login exitoso', rutas, token); // Pasar el privilegio como argumento

      localStorage.setItem('usuarioId', usuario.usu_id.toString());
      localStorage.setItem('usuario', usuario.usu_usuario);
      localStorage.setItem('token', token);
      localStorage.setItem('rutas', JSON.stringify(rutas));
      localStorage.setItem('privilegio', store.privilegio.toString()); // Agregar esta línea

      // Configura dinámicamente las rutas
      await fetchRoutes(router);

      // Redirige al usuario a la primera ruta disponible
      if (rutas.length > 0) {
        const primeraRuta = rutas[0]; // Obtener la primera ruta
        router.push({ name: primeraRuta.ruta_ruta, replace: true }); // Redirigir
      } else {
        // Redirige a una ruta por defecto si no hay acceso
        router.push({ name: 'not-found', params: { catchAll: '*' }, replace: true });
      }
    } else {
      // Manejar el caso en que la respuesta sea undefined
      console.error('Error en el login: la respuesta es undefined');
    }
  } catch (error) {
    console.error('Error en el login:', error); // Registrar el error en la consola
  }
};

const closeModal = () => {
  store.closeModal();
};
</script>

<style scoped></style>
