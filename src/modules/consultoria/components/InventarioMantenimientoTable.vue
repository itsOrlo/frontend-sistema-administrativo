<template>
  <div class="p-4">
    <!-- Encabezado -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-blue-600">Datos Inventario: {{ inventario.length }}</h2>
      <button class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
        + Agregar Inventario
      </button>
    </div>

    <!-- Botones de selección de vista -->
    <div class="flex items-center mb-4">
      <label class="mr-2 font-bold">Vista:</label>
      <input type="radio" id="basica" value="basica" v-model="vistaSeleccionada" class="mr-1" />
      <label for="basica" class="mr-4">BÁSICA</label>

      <input type="radio" id="completa" value="completa" v-model="vistaSeleccionada" class="mr-1" />
      <label for="completa">COMPLETA</label>
    </div>

    <!-- Botones de acciones -->
    <div class="flex gap-2 mb-4">
      <button class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
        Exportar a Excel
      </button>
      <button class="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600">
        Periodo Nuevo
      </button>
    </div>

    <!-- Tabla -->
    <div class="overflow-x-auto bg-white shadow-md rounded-lg">
      <table class="w-full border-collapse border border-gray-300">
        <thead class="bg-gray-100">
          <tr>
            <th
              v-for="columna in columnasSeleccionadas"
              :key="columna"
              class="border border-gray-300 px-4 py-2 text-left"
            >
              {{ columna }}
            </th>
            <!-- Columnas de acciones -->
            <th class="border border-gray-300 px-4 py-2"></th>
            <th class="border border-gray-300 px-4 py-2"></th>
            <th class="border border-gray-300 px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(fila, index) in inventario"
            :key="index"
            :class="{
              'bg-green-100': fila.estado === 'APROBADO AUTOMATICO',
              'bg-yellow-100': fila.estado === 'ENVIADO',
            }"
          >
            <td
              v-for="columna in columnasSeleccionadas"
              :key="columna"
              class="border border-gray-300 px-4 py-2"
            >
              {{ fila[columna] }}
            </td>
            <!-- Botones de acciones -->
            <td class="border border-gray-300 px-4 py-2">
              <button class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                Editar
              </button>
            </td>
            <td class="border border-gray-300 px-4 py-2">
              <button class="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">
                Mantenimiento
              </button>
            </td>
            <td class="border border-gray-300 px-4 py-2">
              <button class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div class="flex justify-center mt-4">
      <button class="px-3 py-1 border rounded-md mx-1">1</button>
      <button class="px-3 py-1 border rounded-md mx-1">2</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Estado para seleccionar la vista (BÁSICA o COMPLETA)
const vistaSeleccionada = ref('basica');

// Definir columnas para ambas vistas
const columnasBasica = [
  'ID',
  'Ubicacion',
  'Dependencia',
  'Nombre Pc',
  'Monitor Marca',
  'Monitor Modelo',
  'Monitor Codigo',
  'Marca Cpu',
  'Modelo Cpu',
  'Codigo Cpu',
  'Usuario',
  'Disco Solido',
  'Estado Mantenimiento',
  'Técnico y Fecha Mantenimiento',
  'Observaciones',
];

const columnasCompleta = [
  'ID',
  'Ubicacion',
  'Dependencia',
  'Nombre Pc',
  'Monitor Marca',
  'Monitor Modelo',
  'Monitor Codigo',
  'Marca Cpu',
  'Modelo Cpu',
  'Codigo Cpu',
  'Marca Procesador',
  'Capacidad Procesador',
  'Marca Ram',
  'Capacidad Ram',
  'Marca Disco',
  'Capacidad Disco',
  'Estado Disco Antes',
  'Estado Disco Actual',
  'Teclado',
  'Mouse',
  'Usuario',
  'Disco Solido',
  'Fecha Compra',
  'Estado Mantenimiento',
  'Técnico y Fecha Mantenimiento',
  'Observaciones',
];

// Computed property para cambiar las columnas según la vista seleccionada
const columnasSeleccionadas = computed(() =>
  vistaSeleccionada.value === 'completa' ? columnasCompleta : columnasBasica,
);

// Datos de ejemplo (debes reemplazar con datos reales)
const inventario = ref([
  {
    ID: '425',
    Ubicacion: '3.2.1',
    Dependencia: 'INGENIERIA',
    NombrePc: 'DTCING5',
    'Monitor Marca': 'HP',
    'Monitor Modelo': 'PRODISPLV P201',
    'Monitor Codigo': '121015002689',
    'Marca Cpu': 'HP',
    'Modelo Cpu': 'Z230 Tower Workstation',
    'Codigo Cpu': '121015002693',
    Usuario: 'jibarra',
    'Disco Solido': 'SSD 240 GB',
    'Estado Mantenimiento': 'APROBADO AUTOMATICO',
    'Técnico y Fecha Mantenimiento': 'Lenin Mena 23/06/24',
    Observaciones: 'APROBADO AUTOMATICO',
    estado: 'APROBADO AUTOMATICO',
  },
  {
    ID: '648',
    Ubicacion: 'BIENESTAR',
    Dependencia: 'INGENIERIA',
    NombrePc: 'PASANTEING3',
    'Monitor Marca': 'HP',
    'Monitor Modelo': 'V193',
    'Monitor Codigo': '121015003066',
    'Marca Cpu': 'HP',
    'Modelo Cpu': 'Compaq 6300 Pro MT',
    'Codigo Cpu': '121015002536',
    Usuario: 'jibarra',
    'Disco Solido': 'SSD 240 GB',
    'Estado Mantenimiento': 'ENVIADO',
    'Técnico y Fecha Mantenimiento': 'Diego Javier Baez Ruales 06/08/24',
    Observaciones: 'Mantenimiento Aceptado',
    estado: 'ENVIADO',
  },
]);
</script>
