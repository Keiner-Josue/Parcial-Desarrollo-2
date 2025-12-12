<template>
  <div class="dashboard-home">
    <div class="row mb-4">
      <div class="col">
        <h2 class="mb-3">
          <i class="bi bi-speedometer2 me-2"></i>
          Panel de Control
        </h2>
        <p class="text-muted">Bienvenido, {{ usuario }}</p>
      </div>
    </div>

    <!-- Estadísticas -->
    <div class="row mb-4">
      <div class="col-md-3 mb-3">
        <div class="card stats-card bg-primary text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="text-uppercase mb-1">Paquetes</h6>
                <h2 class="mb-0">{{ stats.totalPaquetes }}</h2>
              </div>
              <i class="bi bi-suitcase-lg fs-1"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3 mb-3">
        <div class="card stats-card bg-success text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="text-uppercase mb-1">Destinos</h6>
                <h2 class="mb-0">{{ stats.totalDestinos }}</h2>
              </div>
              <i class="bi bi-geo-alt fs-1"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3 mb-3">
        <div class="card stats-card bg-info text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="text-uppercase mb-1">Flota</h6>
                <h2 class="mb-0">{{ stats.totalFlota }}</h2>
              </div>
              <i class="bi bi-airplane fs-1"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3 mb-3">
        <div class="card stats-card bg-warning text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="text-uppercase mb-1">Usuarios</h6>
                <h2 class="mb-0">{{ stats.totalUsuarios }}</h2>
              </div>
              <i class="bi bi-people fs-1"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Paquetes destacados usando ProductCardComponent -->
    <div class="row mb-4">
      <div class="col">
        <h4 class="mb-3">
          <i class="bi bi-star-fill me-2 text-warning"></i>
          Paquetes Turísticos Destacados
        </h4>
      </div>
    </div>

    <div v-if="cargando" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else class="row">
      <div 
        v-for="paquete in paquetesDestacados" 
        :key="paquete.id"
        class="col-md-4 mb-4"
      >
        <ProductCardComponent
          :nombre="paquete.titulo"
          :precio="paquete.precio"
          :descripcion="paquete.descripcion"
          :imagen="paquete.imagen"
        />
      </div>
    </div>

    <!-- Sección adicional: Estadísticas generales -->
    <div class="row mt-5">
      <div class="col">
        <h4 class="mb-3">
          <i class="bi bi-graph-up me-2"></i>
          Estadísticas Generales
        </h4>
      </div>
    </div>

    <div class="row">
      <div class="col-md-4 mb-3" v-for="stat in statsGenerales" :key="stat.etiqueta">
        <div class="card border-0 shadow-sm">
          <div class="card-body text-center">
            <h3 class="text-primary mb-2">{{ stat.numero }}</h3>
            <p class="text-muted mb-0">{{ stat.etiqueta }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import ProductCardComponent from '@/components/ProductCardComponent.vue';
import { API_URLS } from '@/service/api.js';
import usuariosLocal from '@/assets/usuarios.json';
import destinosLocal from '@/assets/destinos.json';
import flyLocal from '@/assets/fly.json';

export default {
  name: 'DashboardProductoView',
  components: {
    ProductCardComponent
  },
  setup() {
    const usuario = ref('');
    const cargando = ref(false);
    const paquetesDestacados = ref([]);
    const statsGenerales = ref([]);

    const stats = ref({
      totalPaquetes: 0,
      totalDestinos: 0,
      totalFlota: 0,
      totalUsuarios: 0
    });

    const cargarDatos = async () => {
      cargando.value = true;
      try {
        // Cargar paquetes
        try {
          const responsePaquetes = await fetch(API_URLS.PRODUCTOS);
          const dataPaquetes = await responsePaquetes.json();
          if (Array.isArray(dataPaquetes)) {
            paquetesDestacados.value = dataPaquetes;
            statsGenerales.value = [];
          } else if (dataPaquetes && Array.isArray(dataPaquetes.paquetes)) {
            paquetesDestacados.value = dataPaquetes.paquetes;
            statsGenerales.value = dataPaquetes.stats || [];
          } else {
            paquetesDestacados.value = [];
            statsGenerales.value = [];
          }
          stats.value.totalPaquetes = paquetesDestacados.value.length;
        } catch (e) {
          // fallback to local data files if API call fails
          const responsePaquetes = await fetch('/data/paquetes.json');
          const dataPaquetes = await responsePaquetes.json();
          paquetesDestacados.value = dataPaquetes.paquetes || [];
          stats.value.totalPaquetes = paquetesDestacados.value.length;
          statsGenerales.value = dataPaquetes.stats || [];
        }

        // Cargar destinos
        try {
          const responseDestinos = await fetch(API_URLS.DESTINOS);
          const dataDestinos = await responseDestinos.json();
          if (Array.isArray(dataDestinos)) {
            stats.value.totalDestinos = dataDestinos.length;
          } else if (dataDestinos && Array.isArray(dataDestinos.destinos)) {
            stats.value.totalDestinos = dataDestinos.destinos.length;
          } else {
            stats.value.totalDestinos = destinosLocal.length;
          }
        } catch (e) {
          console.warn('Fallo al obtener destinos desde API, usando datos locales:', e);
          stats.value.totalDestinos = destinosLocal.length;
        }

        // Cargar flota
        try {
          const responseFlota = await fetch(API_URLS.FLOTA);
          const dataFlota = await responseFlota.json();
          if (Array.isArray(dataFlota)) {
            stats.value.totalFlota = dataFlota.length;
          } else if (dataFlota && Array.isArray(dataFlota.flota)) {
            stats.value.totalFlota = dataFlota.flota.length;
          } else {
            stats.value.totalFlota = flyLocal.length;
          }
        } catch (e) {
          console.warn('Fallo al obtener flota desde API, usando datos locales:', e);
          stats.value.totalFlota = flyLocal.length;
        }

        // Cargar usuarios
        try {
          const responseUsuarios = await fetch(API_URLS.USUARIOS);
          let dataUsuarios = await responseUsuarios.json();
          if (!Array.isArray(dataUsuarios) || dataUsuarios.length === 0) {
            dataUsuarios = usuariosLocal;
          }
          stats.value.totalUsuarios = dataUsuarios.length;
        } catch (e) {
          const responseUsuarios = await fetch('/data/usuarios.json');
          const dataUsuarios = await responseUsuarios.json();
          stats.value.totalUsuarios = dataUsuarios.length;
        }

      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        cargando.value = false;
      }
    };

    onMounted(() => {
      usuario.value = localStorage.getItem('usuario') || 'Usuario';
      cargarDatos();
    });

    return {
      usuario,
      cargando,
      paquetesDestacados,
      stats,
      statsGenerales
    };
  }
};
</script>

<style scoped>
.dashboard-home {
  animation: fadeIn 0.5s;
}

@keyframes fadeIn {
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

.stats-card {
  border: none;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.stats-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.stats-card h6 {
  font-size: 0.75rem;
  font-weight: 600;
  opacity: 0.9;
  letter-spacing: 0.05em;
}

.stats-card h2 {
  font-weight: 800;
  font-size: 2.5rem;
}

.text-warning {
  color: #ffc107 !important;
}
</style>