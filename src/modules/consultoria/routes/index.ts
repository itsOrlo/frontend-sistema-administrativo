import type { RouteRecordRaw } from 'vue-router';

const consultoriaRoute: RouteRecordRaw[] = [
  {
    path: '/centro-actividades/:tramite',
    name: 'centroActividades',
    component: () => import('@/modules/consultoria/views/CentroActividades.vue'),
    props: true,
  },
];

export default consultoriaRoute;
