<template>
  <Transition name="fade">
    <div v-if="mostrarModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white p-4 rounded shadow-lg">
        <h2 class="text-lg font-bold mb-4">Modal de Prueba</h2>
        <p>Este es un modal de prueba para verificar si el problema es el componente ConsultoriaTable o EditarConsultoria.</p>
        <button @click="handleClose" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Cerrar</button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const props = defineProps<{ mostrarModal: boolean }>();
const emit = defineEmits<{ 'cerrar-modal': [] }>();

const handleClose = () => {
  emit('cerrar-modal');
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
