<template>
    <div class="space-y-4 flex flex-col">
      <div v-if="opciones.includes('DISC')" class="bg-white shadow p-4 rounded-lg flex-1">
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-sm font-semibold text-gray-700">DISC</h3>
          <span class="text-green-500">Completo</span>
        </div>
      </div>
  
      <div v-if="opciones.includes('CURRICULUM')" class="bg-white shadow p-4 rounded-lg flex-1 cursor-pointer">
        <div @click="irACurriculum" class="flex justify-between items-center mb-2 hover:bg-gray-200 transition-colors duration-200 p-2 rounded">
          <h3 class="text-sm font-semibold text-gray-700">CURRICULUM</h3>
          <span class="text-red-500">Pendiente</span>
        </div>
        <div class="relative">
          <input
            type="range"
            min="0"
            max="100"
            :value="pesoCurriculum"
            @input="updatePesoCurriculum($event)"
            class="w-full h-2 bg-gray-200 rounded-lg overflow-hidden appearance-none cursor-pointer accent-red-500"
          />
          <span class="absolute left-1/2 transform -translate-x-1/2 -top-6 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-md">{{ pesoCurriculum }}%</span>
        </div>
      </div>
  
      <div v-if="opciones.includes('CONOCIMIENTO')" class="bg-white shadow p-4 rounded-lg flex-1 cursor-pointer">
        <div @click="irAKnowledge" class="flex justify-between items-center mb-2 hover:bg-gray-200 transition-colors duration-200 p-2 rounded">
          <h3 class="text-sm font-semibold text-gray-700">CONOCIMIENTO</h3>
          <span class="text-red-500">Pendiente</span>
        </div>
        <div class="relative">
          <input
            type="range"
            min="0"
            max="100"
            :value="pesoConocimiento"
            @input="updatePesoConocimiento($event)"
            class="w-full h-2 bg-gray-200 rounded-lg overflow-hidden appearance-none cursor-pointer accent-red-500"
          />
          <span class="absolute left-1/2 transform -translate-x-1/2 -top-6 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-md">{{ pesoConocimiento }}%</span>
        </div>
      </div>
  
      <div v-if="opciones.includes('COMPETENCIAS')" class="bg-white shadow p-4 rounded-lg flex-1 cursor-pointer">
        <div @click="irACompetencias" class="flex justify-between items-center mb-2 hover:bg-gray-200 transition-colors duration-200 p-2 rounded">
          <h3 class="text-sm font-semibold text-gray-700">COMPETENCIAS</h3>
          <span class="text-red-500">Pendiente</span>
        </div>
        <div class="relative">
          <input
            type="range"
            min="0"
            max="100"
            :value="pesoCompetencias"
            @input="updatePesoCompetencias($event)"
            class="w-full h-2 bg-gray-200 rounded-lg overflow-hidden appearance-none cursor-pointer accent-red-500"
          />
          <span class="absolute left-1/2 transform -translate-x-1/2 -top-6 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-md">{{ pesoCompetencias }}%</span>
        </div>
      </div>
  
      <div v-if="opciones.includes('VIDEO_ENTREVISTA')" class="bg-white shadow p-4 rounded-lg flex-1 cursor-pointer">
        <div @click="irAEntrevista" class="flex justify-between items-center mb-2 hover:bg-gray-200 transition-colors duration-200 p-2 rounded">
          <h3 class="text-sm font-semibold text-gray-700">VIDEO ENTREVIISTA</h3>
          <span class="text-red-500">Pendiente</span>
        </div>
        <div class="relative">
          <input
            type="range"
            min="0"
            max="100"
            :value="pesoVideoEntrevista"
            @input="updatePesoVideoEntrevista($event)"
            class="w-full h-2 bg-gray-200 rounded-lg overflow-hidden appearance-none cursor-pointer accent-red-500"
          />
          <span class="absolute left-1/2 transform -translate-x-1/2 -top-6 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-md">{{ pesoVideoEntrevista }}%</span>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
  opciones: string[],
  pesoCurriculum: number,
  pesoConocimiento: number,
  pesoCompetencias: number,
  pesoVideoEntrevista: number,
  sumatoriaPesos: number,
}>();

const pesoCurriculum = ref(props.pesoCurriculum);
const pesoConocimiento = ref(props.pesoConocimiento);
const pesoCompetencias = ref(props.pesoCompetencias);
const pesoVideoEntrevista = ref(props.pesoVideoEntrevista);

const router = useRouter();

const irACurriculum = () => {
  router.replace('/curriculum');
};

const irAKnowledge = () => {
  router.replace('/conocimiento');
};

const irACompetencias = () => {
  router.replace('/competencia');
};

const irAEntrevista = () => {
  router.replace('/videoEntrevista');
};


// Métodos para actualizar pesos
const updatePesoCurriculum = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  pesoCurriculum.value = Number(value);
}

const updatePesoConocimiento = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  pesoConocimiento.value = Number(value);
}

const updatePesoCompetencias = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  pesoCompetencias.value = Number(value);
}

const updatePesoVideoEntrevista = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  pesoVideoEntrevista.value = Number(value);
}
</script>

<style scoped>
</style>
