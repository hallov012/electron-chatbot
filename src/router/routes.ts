import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',

    component: () => import('pages/IndexPage.vue'),
  },
  {
    path: '/chat',
    component: () => import('layouts/MainLayout.vue'),
    redirect: '/chat/gpt',
    children: [
      { path: 'gpt', component: () => import('pages/ChatPage.vue') },
      { path: 'xcap', component: () => import('pages/ChatPage.vue') }
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
