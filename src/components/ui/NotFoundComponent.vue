<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="text-center">
        <h1 class="text-9xl font-extrabold text-gray-800 mb-4">404</h1>
        <p class="text-2xl md:text-3xl text-gray-600 mb-8">Oops! The page you are looking for does not exist.</p>
        <a href="/dashboard" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Go to {{ isAuth ? 'Dashboard' : 'Login' }}
        </a>
    </div>

    </div>
</template>

<script setup lang="ts">
const isAuth: boolean = JSON.parse(localStorage.getItem('autenticacion') || '{}').loginStatus;
</script>

<style scoped>

</style>