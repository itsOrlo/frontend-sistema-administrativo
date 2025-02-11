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

          <button type="submit" :class="[
            isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700', 
            'w-full py-3 px-4 rounded-lg text-white font-semibold transition duration-200 transform hover:scale-[1.02]'
          ]" :disabled="isSubmitting">
            {{ isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>
        </form>
      </div>
    </div>
  </LoginLayout>

  <div v-if="store.showModal" class="fixed z-10 inset-0 overflow-y-auto" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900">{{ store.titleError }}</h3>
              <p class="text-sm text-gray-500">{{ store.messageError }}</p>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button @click="closeModal" class="w-full inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm">
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
import { fetchRoutes } from '@/utils/route-utils';

const query = useLogin();
const username = ref('');
const password = ref('');
const router = useRouter();
const store = useAutenticacionStore();
const isSubmitting = ref(false); // ✅ Variable local para evitar cambio de estado automático

const submit = async () => {
  try {
    const response = await query.mutateAsync({
      username: username.value,
      password: password.value,
    });

    if (response) {
      const { usuario, rol, rutas, token } = response;

      // 🔹 Guardar en el store
      store.onLogginSuccess(true, usuario, rol, rutas, token);

      // 🔹 Guardar en localStorage
      localStorage.setItem('usuarioId', usuario.usu_id.toString());
      localStorage.setItem('usuario', usuario.usu_nombre);
      localStorage.setItem('token', token);
      localStorage.setItem('rutas', JSON.stringify(rutas));

      // 🔹 Esperar a que las rutas dinámicas se configuren antes de continuar
      console.log('🔄 Esperando a que las rutas se registren...');
      await fetchRoutes(router, rutas);

      console.log('✅ Rutas registradas. Redirigiendo al usuario...');

      // 🔹 Redirigir solo después de que las rutas estén listas
      if (rutas.length > 0) {
        router.push({ path: rutas[0].ruta_url, replace: true });
      } else {
        router.push({ name: 'dashboard', replace: true });
      }
    }
  } catch (error) {
    console.error('❌ Error en el login:', error);
  }
};


const closeModal = () => {
  store.closeModal();
};
</script>
