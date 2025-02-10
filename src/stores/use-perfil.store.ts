import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePerfilStore = defineStore('perfil', () => {
  const nombre = ref('');
  const nivel = ref('');
  const opciones = ref<string[]>([]);

  const setPerfil = (nuevoNombre: string, nuevoNivel: string, nuevasOpciones: string[]) => {
    nombre.value = nuevoNombre;
    nivel.value = nuevoNivel;
    opciones.value = nuevasOpciones;
  };

  return {
    nombre,
    nivel,
    opciones,
    setPerfil
  };
});
