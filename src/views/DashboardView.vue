<template>
  <div class="dashboard-layout">
    <NavbarComponent @logout="handleLogout" />
    
    <div class="dashboard-container">
      <SidebarComponent />
      
      <main class="dashboard-content">
        <router-view />
      </main>
    </div>
    
    <FooterComponent />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import NavbarComponent from '@/components/NavbarComponent.vue';
import SidebarComponent from '@/components/SidebarComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';

const router = useRouter();

const handleLogout = () => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('usuario');
  router.push('/login');
};
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.dashboard-container {
  display: flex;
  flex: 1;
}

.dashboard-content {
  flex: 1;
  padding: 2rem;
  background: #f8fafc;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .dashboard-content {
    padding: 1rem;
  }
}
</style>