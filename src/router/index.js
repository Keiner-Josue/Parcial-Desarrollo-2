import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import DashboardView from '../views/DashboardView.vue';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard-home',
        component: () => import('../views/DashboardProductoView.vue')
      },
      {
        path: 'productos',
        name: 'productos',
        component: () => import('../views/PaquetesView.vue')
      },
      {
        path: 'flota',
        name: 'flota',
        component: () => import('../views/FlotaView.vue')
      },
      {
        path: 'destinos',
        name: 'destinos',
        component: () => import('../views/DestinosView.vue')
      },
      {
        path: 'usuarios',
        name: 'usuarios',
        component: () => import('../views/UsuariosView.vue')
  }

    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Guard de navegación para rutas protegidas
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && isAuthenticated) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;