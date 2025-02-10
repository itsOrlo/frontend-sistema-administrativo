<template>
    <div v-if="open"
        class="fixed z-60 top-0 left-0 flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-50">
        <div class="bg-white rounded shadow-lg w-1/3">
            <div class="px-4 py-2 flex justify-between items-center">
                <h2 class="text-xl">Error</h2>
                <button @click="closeModal" class="text-lg">X</button>
            </div>
            <div class="p-4">
                <p>{{ mensaje }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

// Define las propiedades del componente
defineProps({
    open: {
        type: Boolean,
        default: false
    },
    mensaje: {
        type: String,
        default: ''
    }
})

// Define los eventos que el componente puede emitir
const emit = defineEmits(['close'])

const closeModal = () => {
    emit('close');
};
</script>

<style scoped></style>