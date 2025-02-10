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
        <details class="faq-item" v-for="faq in filteredFAQs" :key="faq.question">
          <summary class="faq-question">{{ faq.question }}</summary>
          <div class="faq-answer" v-html="faq.answer"></div>
        </details>
        <details class="faq-item">
          <summary class="faq-question">Formato y tamaño de archivos para consultorías</summary>
          <div class="faq-answer">
            <p>Al crear una consultoría, tenga en cuenta las siguientes restricciones para los archivos adjuntos:</p>
            <ul class="list-disc list-inside">
              <li><strong>Formato admitido:</strong> Solo se admite el formato PDF. Esto se debe a que el formato PDF es ampliamente compatible y asegura que el contenido del documento se mantenga consistente y sin alteraciones.</li>
              <li><strong>Tamaño máximo:</strong> El tamaño máximo por archivo es de 20MB. Esta restricción se establece para asegurar un rendimiento óptimo del sistema y evitar problemas de almacenamiento.</li>
            </ul>
          </div>
        </details>
        <details class="faq-item">
          <summary class="faq-question">Uso de tarjetas de colores</summary>
          <div class="faq-answer">
            <p>Para ayudar a los usuarios a comprender a qué categoría corresponde cada dato, se han implementado tarjetas de colores en el sistema. Algunos ejemplos incluyen:</p>
            <ul class="list-disc list-inside">
              <li><strong>Tipo de Empresa:</strong> Cada tipo de empresa está representado por una tarjeta de color diferente para facilitar su identificación visual.</li>
              <li><strong>Estado de Consultoría:</strong> Los diferentes estados de una consultoría (por ejemplo, en progreso, completada, pendiente) están codificados por colores para una rápida referencia.</li>
            </ul>
          </div>
        </details>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import DashboardLayout from '@/modules/dashboard/layouts/DashboardLayout.vue';

const searchQuery = ref('');
const faqs = ref([
  {
    question: '¿Cómo descargar un reporte?',
    answer: `<p>Para descargar un reporte en cualquier vista (dependencias, clientes o consultorías), siga los siguientes pasos:</p>
             <ol class="list-decimal list-inside">
               <li>Vaya a la vista correspondiente en el menú principal.</li>
               <li>Utilice los filtros disponibles para ajustar los parámetros de búsqueda según sus necesidades.</li>
               <li>Haga clic en el botón "Exportar" para obtener el reporte en formato Excel.</li>
             </ol>`
  },
  {
    question: 'Consideraciones Generales',
    answer: `<p>Tenga en cuenta las siguientes consideraciones al usar el sistema de consultoría:</p>
             <ul class="list-disc list-inside">
               <li>Asegúrese de mantener su información actualizada.</li>
               <li>Revise regularmente las consultas y proyectos en marcha.</li>
               <li>Contacte al soporte técnico si encuentra algún problema.</li>
             </ul>`
  },
  {
    question: 'Explicación de los KPIs',
    answer: `<p>Los siguientes KPIs son importantes para el seguimiento y gestión en el sistema de consultoría:</p>
             <ul class="list-disc list-inside">
               <li><strong>Clientes:</strong> Número total de clientes registrados en el sistema.</li>
               <li><strong>Consultas del Mes:</strong> Número total de consultas realizadas en el mes actual.</li>
               <li><strong>Proyectos en Marcha:</strong> Número total de proyectos que están actualmente en progreso.</li>
               <li><strong>Dependencias:</strong> Número total de dependencias registradas en el sistema.</li>
             </ul>`
  },
  {
    question: 'Uso de tarjetas de colores',
    answer: `<p>Para ayudar a los usuarios a comprender a qué categoría corresponde cada dato, se han implementado tarjetas de colores en el sistema. Algunos ejemplos incluyen:</p>
             <ul class="list-disc list-inside">
               <li><strong>Tipo de Empresa:</strong> Cada tipo de empresa está representado por una tarjeta de color diferente para facilitar su identificación visual.</li>
               <li><strong>Estado de Consultoría:</strong> Los diferentes estados de una consultoría (por ejemplo, en progreso, completada, pendiente) están codificados por colores para una rápida referencia.</li>
             </ul>`
  }
]);

const filteredFAQs = computed(() => {
  return faqs.value.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.value.toLowerCase())
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
</style>
