<template>
  <div>
    <h1>Centro de Actividades</h1>
    <p>Trámite: {{ tramite }}</p>
    <!-- Aquí puedes agregar más contenido relacionado con el trámite -->
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{
  tramite: string;
}>();
</script>
