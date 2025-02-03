<template>
    <div v-if="mostrarModal" @close="cerrarModal">

        <form @submit.prevent="actualizarPerfil">
            <div class="bg-white p-6 rounded-lg shadow-xl max-w-3xl mx-auto">
                <div class="sm:flex sm:items-start">
                    <div class="w-full text-center sm:text-left">
                        <h3 class="text-2xl font-semibold text-gray-900 leading-tight mb-4">Actualizar Perfil</h3>
                        <div class="overflow-y-auto" style="max-height: 400px;">
                            <div class="mb-6">
                                <label for="nombre" class="block text-gray-700 text-sm font-bold mb-2">Nombre del
                                    Perfil</label>
                                <input v-model="perfil.nombre" type="text" id="nombre"
                                    class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ej. Analista de Talento Humano" />
                                <p v-if="mensajeError" class="text-red-500 text-sm mt-1">{{ mensajeError }}</p>
                            </div>

                            <div class="mb-6">
                                <label for="nivel" class="block text-gray-700 text-sm font-bold mb-2">Nivel de
                                    Contribución</label>
                                <input v-model="perfil.nivel" type="text" id="nivel"
                                    class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ej. Senior" />
                            </div>

                            <!-- Aquí puedes incluir otras opciones de componentes si es necesario -->

                        </div>
                    </div>
                </div>
                <div class="flex justify-end mt-4">
                    <button @click="cerrarModal" type="button"
                        class="bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-gray-400 mr-2">
                        Cancelar
                    </button>
                    <button type="submit"
                        class="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600">
                        Actualizar
                    </button>
                </div>
            </div>
        </form>

    </div>
</template>

<script setup>
import { ref } from 'vue';

const mostrarModal = ref(false);
const perfil = ref({ nombre: '', nivel: '' }); // Cambia según la estructura de tu perfil
const mensajeError = ref('');

const abrirModal = (data) => {
    perfil.value = { nombre: data.perf_nombre, nivel: data.perf_nivel_contribucion }; // Clonar los datos del perfil a editar
    mostrarModal.value = true;
};

const cerrarModal = () => {
    mostrarModal.value = false;
    mensajeError.value = '';
};

const actualizarPerfil = async () => {
    if (!perfil.value.nombre || !perfil.value.nivel) {
        mensajeError.value = 'Por favor completa todos los campos.';
        return;
    }

    try {
        const usuarioId = localStorage.getItem('usuarioId');
        const perfilId = data.perf_id; // Asegúrate de tener acceso al ID del perfil

        // Prepara los datos para la actualización
        const perfilDto = {
            perfilId: perfilId,
            perf_nombre: perfil.value.nombre,
            perf_nivel_contribucion: perfil.value.nivel,
            usu_id: Number(usuarioId),
        };

        // Llama a tu método de mutación para actualizar el perfil
        await useApi.put(`/api/v1/perfiles/${perfilId}`, perfilDto);

        Swal.fire({
            icon: 'success',
            title: 'Perfil Actualizado',
            text: 'El perfil se ha actualizado correctamente.',
        });

        // Opcional: cierra el modal después de actualizar
        cerrarModal();

        // Actualiza la lista de perfiles
        await obtenerPerfiles();

    } catch (error) {
        console.error('Error actualizando el perfil:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar el perfil.',
        });
    }
};
</script>
