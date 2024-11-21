<template>
  <div>
    <label :for="id" class="block text-gray-700 font-bold mb-2">
      {{ label }}:
    </label>

    <template v-if="type === 'select'">
      <select
        :id="id"
        v-model="inputValue"
        class="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        :required="required"
      >
        <option value="" disabled>Seleccione una opción</option>
        <option
          v-for="(label, value) in options"
          :key="value"
          :value="value"
        >
          {{ label }}
        </option>
      </select>
    </template>

    <template v-else>
      <input
        :id="id"
        :type="type"
        v-model="inputValue"
        class="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        :required="required"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  id: string;
  label: string;
  type: string;
  modelValue: string | number;
  required?: boolean;
  options?: Record<number | string, string>;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
}>();

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  },
});
</script>