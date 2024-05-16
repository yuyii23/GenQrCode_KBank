import { createRouter, createWebHistory } from 'vue-router';
export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/Main.vue'),
    },
    {
      path: '/complete',
      name: 'Complete',
      component: () => import('@/views/Complete.vue'),
    },
    {
      path: '/qr-code/:id',
      name: 'QrCode',
      component: () => import('@/views/QRCode.vue'),
    },
  ],
  linkActiveClass: 'router-link-active',
});

