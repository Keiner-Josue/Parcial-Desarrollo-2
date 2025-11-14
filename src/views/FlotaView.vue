<template>
  <div class="flota-view">
    <h2 class="mb-4">
      <i class="bi bi-airplane me-2"></i>
      Nuestra Flota
    </h2>

    <div v-if="cargando" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else class="row">
      <div 
        v-for="avion in flota" 
        :key="avion.id"
        class="col-lg-6 mb-4"
      >
        <div class="card h-100 shadow-sm">
          <img 
            :src="avion.imagen" 
            :alt="avion.nombre"
            class="card-img-top"
            style="height: 250px; object-fit: cover;"
          />
          <div class="card-body">
            <h5 class="card-title">{{ avion.nombre }}</h5>
            
            <div class="mb-3">
              <div class="d-flex justify-content-between mb-2">
                <span class="badge bg-primary">
                  <i class="bi bi-people me-1"></i>
                  Capacidad: {{ avion.capacidad }}
                </span>
                <span class="badge bg-info">
                  <i class="bi bi-airplane me-1"></i>
                  En servicio: {{ avion['En servicio'] }}
                </span>
              </div>
            </div>

            <p class="card-text text-muted">{{ avion.descripcion }}</p>

            <div class="mt-3">
              <h6 class="text-uppercase text-muted" style="font-size: 0.85rem;">
                Servicios incluidos:
              </h6>
              <ul class="list-unstyled">
                <li 
                  v-for="(servicio, index) in avion.servicios" 
                  :key="index"
                  class="mb-1"
                >
                  <i class="bi bi-check-circle-fill text-success me-2"></i>
                  {{ servicio }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const flota = ref([]);
const cargando = ref(false);

const cargarFlota = async () => {
  cargando.value = true;
  try {
    const response = await fetch('/data/fly.json');
    flota.value = await response.json();
  } catch (error) {
    console.error('Error cargando flota:', error);
  } finally {
    cargando.value = false;
  }
};

onMounted(() => {
  cargarFlota();
});
</script>

<style scoped>
.flota-view {
  animation: fadeIn 0.5s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.card {
  transition: transform 0.3s;
}

.card:hover {
  transform: translateY(-5px);
}
</style>