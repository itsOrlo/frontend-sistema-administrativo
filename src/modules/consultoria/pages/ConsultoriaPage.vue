<template>
  <DashboardLayout>
    <div class="bienvenido-container">
      <div class="welcome-message">
        <img
          src="https://res.cloudinary.com/dw8oyuntj/image/upload/apusxpslr1qq9med9jaf"
          alt="Bienvenido"
          class="welcome-image"
        />
        <h1 class="text-3xl font-bold text-gray-800 dark:text-white">
          Bienvenido al Sistema de Consultoría
        </h1>
        <p class="text-gray-600 dark:text-gray-300 mt-2">
          Como usuario, podrá navegar por las siguientes secciones:
        </p>
      </div>
      <div class="content-columns mt-8">
        <div class="left-column">
          <img
            src="https://res.cloudinary.com/dw8oyuntj/image/upload/vhgnv1vk3vu9n9acfdvk"
            alt="Próximamente"
            class="coming-soon-image"
          />
        </div>
        <div class="navigation-list">
          <ul>
            <li class="nav-item">
              <router-link to="/listar" class="nav-link">
                <i class="fas fa-users mr-2"></i>Listado de Clientes
                <p class="nav-description">Visualice todos los clientes registrados.</p>
                <i class="fas fa-chevron-right ml-auto"></i>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/consultoria-clientes" class="nav-link">
                <i class="fas fa-user-tie mr-2"></i>Consultoría de Clientes
                <p class="nav-description">Acceda a las consultas e insights.</p>
                <i class="fas fa-chevron-right ml-auto"></i>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/listarDependencias" class="nav-link">
                <i class="fas fa-building mr-2"></i>Listado de Dependencias
                <p class="nav-description">Acceda a las dependencias y sus relaciones.</p>
                <i class="fas fa-chevron-right ml-auto"></i>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/listarConsultorias" class="nav-link">
                <i class="fa fa-briefcase mr-2"></i>Listado de Consultorías
                <p class="nav-description">
                  Revise, gestione y realice seguimiento de todas las consultorías.
                </p>
                <i class="fas fa-chevron-right ml-auto"></i>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from '@/modules/dashboard/layouts/DashboardLayout.vue';
</script>

<style scoped lang="postcss">
.bienvenido-container {
  padding: 2rem;
  text-align: center;
}

.welcome-message {
  @apply p-6 rounded-lg shadow-sm border bg-white mx-auto max-w-3xl;
}

.welcome-image {
  @apply mx-auto mb-4;
  width: 250px;
}

.content-columns {
  @apply flex justify-center;
}

.left-column {
  @apply mr-8 flex justify-center;
}

.coming-soon-image {
  @apply mx-auto mb-4;
  width: 280px;
}

.navigation-list {
  @apply flex justify-center;
}

.navigation-list ul {
  @apply list-none p-0;
}

.nav-item {
  @apply mb-6 p-4 rounded-lg shadow-sm border bg-white flex items-center cursor-pointer hover:bg-gray-100 transition-colors duration-200;
}

.nav-link {
  @apply text-blue-500 text-xl font-semibold flex items-center w-full;
}

.nav-description {
  @apply text-gray-600 dark:text-gray-300 mt-1 ml-8 flex-grow text-sm;
}
</style>
