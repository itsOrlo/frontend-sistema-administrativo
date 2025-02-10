<template>
  <DashboardLayout>
    <div class="faq-container">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-6">Preguntas Frecuentes</h1>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar..."
        class="search-input mb-6 p-2 border rounded w-full"
      />
      <div class="faq-section">
        <details class="faq-item" v-for="faq in filteredFAQs" :key="faq.conf_titulo">
          <summary class="faq-question">{{ faq.conf_titulo }}</summary>
          <div class="faq-answer" v-html="faq.conf_detalle"></div>
          <video v-if="faq.conf_video" :src="faq.conf_video" controls class="faq-video"></video>
        </details>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import DashboardLayout from '@/modules/dashboard/layouts/DashboardLayout.vue';
import { useFAQ } from '@/modules/consultoria/composables/useFAQ';

const searchQuery = ref('');
const { faqs, fetchFAQs } = useFAQ();

onMounted(() => {
  fetchFAQs();
});

const filteredFAQs = computed(() => {
  return faqs.value.filter(faq =>
    faq.conf_titulo.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    faq.conf_detalle.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
</script>

<style scoped lang="postcss">
.faq-container {
  padding: 2rem;
}

.search-input {
  @apply mb-6 p-2 border rounded w-full;
}

.faq-section {
  @apply mb-8;
}

.faq-item {
  @apply mb-4 p-4 rounded-lg shadow-sm border bg-white dark:bg-gray-800 dark:border-gray-700;
}

.faq-question {
  @apply text-xl font-semibold text-gray-800 dark:text-white cursor-pointer;
}

.faq-answer {
  @apply mt-2 text-gray-600 dark:text-gray-300;
}

.faq-video {
  @apply mt-4 w-full;
}
</style>
