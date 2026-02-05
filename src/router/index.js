import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/register',
    },
    {
      path: '/register',
      name: 'registration',
      component: () => import('@/pages/RegistrationPage.vue'),
      meta: {
        title: 'Registration - Manila FAME Event',
        layout: 'default',
      },
    },
  ],
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Manila FAME Event'
  next()
})

export default router
