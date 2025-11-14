<template>
  <aside class="sidebar bg-light border-end">
    <nav class="nav flex-column p-3">
      <h6 class="sidebar-heading text-muted text-uppercase mb-3">
        <i class="bi bi-grid me-2"></i>
        Menú Principal
      </h6>
      
      <router-link 
        to="/dashboard" 
        class="nav-link"
        exact-active-class="active"
      >
        <i class="bi bi-house-door me-2"></i>
        Inicio
      </router-link>
      
      <router-link 
        to="/dashboard/productos" 
        class="nav-link"
        active-class="active"
      >
        <i class="bi bi-box-seam me-2"></i>
        Productos
      </router-link>
      
      <router-link 
        to="/dashboard/flota" 
        class="nav-link"
        active-class="active"
      >
        <i class="bi bi-airplane me-2"></i>
        Flota
      </router-link>
      
      <router-link 
        to="/dashboard/destinos" 
        class="nav-link"
        active-class="active"
      >
        <i class="bi bi-geo-alt me-2"></i>
        Destinos
      </router-link>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 250px;
  min-height: calc(100vh - 56px);
  position: sticky;
  top: 56px;
}

.sidebar-heading {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.nav-link {
  color: #64748b;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin-bottom: 0.25rem;
  transition: all 0.3s;
  font-weight: 500;
}

.nav-link:hover {
  background: #e2e8f0;
  color: #1a1d3a;
}

.nav-link.active {
  background: linear-gradient(135deg, #00d4ff, #7c3aed);
  color: white;
}

.nav-link i {
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    position: relative;
    min-height: auto;
  }
}
</style>