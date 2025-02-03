import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { useThemeStore } from './stores/use-theme.store';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);

// Inicializar el tema
const themeStore = useThemeStore();
themeStore.initTheme();

app.use(router);
app.use(VueQueryPlugin);

app.mount('#app');
