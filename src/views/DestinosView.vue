<template>
  <div class="destinos-view">
    <h2 class="mb-4">
      <i class="bi bi-geo-alt me-2"></i>
      Destinos Disponibles
    </h2>

    <div v-if="cargando" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else class="row">
      <div 
        v-for="destino in destinos" 
        :key="destino.id"
        class="col-md-6 col-lg-4 mb-4"
      >
        <div class="card h-100 shadow-sm destino-card">
          <div class="position-relative">
            <img 
              :src="destino.imagen" 
              :alt="destino.ciudad"
              class="card-img-top"
              style="height: 200px; object-fit: cover;"
            />
            <span class="badge bg-dark position-absolute top-0 end-0 m-3">
              {{ destino.pais }}
            </span>
          </div>

          <div class="card-body">
            <h5 class="card-title">{{ destino.ciudad }}</h5>

            <div class="mb-3">
              <small class="text-muted d-block mb-1">
                <i class="bi bi-clock me-1"></i>
                Duración: {{ destino.duracion }}
              </small>
              <small class="text-muted d-block mb-1">
                <i class="bi bi-rulers me-1"></i>
                Distancia: {{ destino.distancia }} km
              </small>
              <small class="text-muted d-block mb-1">
                <i class="bi bi-airplane me-1"></i>
                {{ destino.avion }}
              </small>
            </div>

            <p class="card-text small">{{ destino.descripcion }}</p>

            <div class="d-flex justify-content-between align-items-center mt-3">
              <div>
                <span 
                  :class="destino.escalas === 0 ? 'badge bg-success' : 'badge bg-warning'"
                >
                  {{ destino.escalas === 0 ? 'Directo' : `${destino.escalas} escala(s)` }}
                </span>
              </div>
              <div class="text-end">
                <small class="text-muted d-block">Desde</small>
                <strong class="text-primary fs-5">
                  ${{ destino.precio.toLocaleString('es-CO') }}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { API_URLS } from '@/service/api.js';
import destinosLocal from '@/assets/destinos.json';

const destinos = ref([]);
const cargando = ref(false);

const cargarDestinos = async () => {
  cargando.value = true;
  try {
    const response = await fetch(API_URLS.DESTINOS);
    const data = await response.json();
    if (Array.isArray(data)) {
      destinos.value = data;
    } else if (data && Array.isArray(data.destinos)) {
      destinos.value = data.destinos;
    } else {
      destinos.value = destinosLocal;
    }
  } catch (error) {
    console.error('Error cargando destinos desde API, usando fallback local:', error);
    destinos.value = destinosLocal;
  } finally {
    cargando.value = false;
  }
};

onMounted(() => {
  cargarDestinos();
});
</script>

<style scoped>
.destinos-view {
  animation: fadeIn 0.5s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.destino-card {
  transition: transform 0.3s, box-shadow 0.3s;
}

.destino-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15) !important;
}
</style>