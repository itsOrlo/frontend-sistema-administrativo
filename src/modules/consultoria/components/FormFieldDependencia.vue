<template>
    <div>
      <label :for="id" class="block text-gray-700 font-bold mb-2">
        {{ label }}:
      </label>
      
      <template v-if="type === 'select'">
        <select
          :id="id"
          :value="modelValue"
          @input="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
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
          :value="modelValue"
          @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
          class="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          :required="required"
        />
      </template>
    </div>
  </template>
  
  <script setup lang="ts">
  interface Props {
    id: string;
    label: string;
    type: string;
    modelValue: string | number;
    required?: boolean;
    options?: Record<number | string, string>;
  }
  
  defineProps<Props>();
  defineEmits<{
    'update:modelValue': [value: string | number];
  }>();
  </script>