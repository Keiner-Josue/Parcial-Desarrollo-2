<template>
  <div class="destinos-view">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">
        <i class="bi bi-geo-alt me-2"></i>
        Destinos Disponibles
      </h2>

      <button class="btn btn-primary" @click="abrirModalNuevo" data-bs-toggle="modal" data-bs-target="#destinoModal">
        <i class="bi bi-plus-circle me-2"></i> Nuevo Destino
      </button>
    </div>

    <!-- Alertas -->
    <div v-if="alerta.visible" :class="`alert alert-${alerta.tipo} alert-dismissible fade show`" role="alert">
      {{ alerta.mensaje }}
      <button type="button" class="btn-close" @click="alerta.visible = false"></button>
    </div>

    <!-- Loading -->
    <div v-if="cargando" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div>
    </div>

    <!-- Cards -->
    <div v-else class="row gx-3 gy-4">
      <div class="col-md-6 col-lg-4" v-for="d in destinos" :key="d.id">
        <div class="card h-100 shadow-sm destino-card">
          <div class="position-relative">
            <img :src="d.imagen" :alt="d.ciudad" class="card-img-top destino-img" />
            <span class="badge bg-dark position-absolute top-0 end-0 m-3">{{ d.pais }}</span>
          </div>

          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ d.ciudad }}</h5>

            <div class="mb-2 text-muted small">
              <div><i class="bi bi-clock me-1"></i> Duración: {{ d.duracion }}</div>
              <div><i class="bi bi-rulers me-1"></i> Distancia: {{ d.distancia }} km</div>
              <div><i class="bi bi-airplane me-1"></i> {{ d.avion }}</div>
            </div>

            <p class="card-text small text-truncate-3">{{ d.descripcion }}</p>

            <div class="d-flex justify-content-between align-items-center mt-3">
              <div>
                <span v-if="d.escalas === 0" class="badge bg-success">Directo</span>
                <span v-else class="badge bg-warning text-dark">
                  {{ d.escalas }} escala(s)
                </span>
                <!-- show scale cities if exist -->
                <div v-if="d.escalas > 0 && d.escalasCiudades && d.escalasCiudades.length" class="mt-2 small text-muted">
                  <i class="bi bi-geo me-1"></i> {{ d.escalasCiudades.join(', ') }}
                </div>
              </div>

              <div class="text-end">
                <small class="text-muted d-block">Desde</small>
                <strong class="text-primary fs-5">${{ formatPrice(d.precio) }}</strong>
              </div>
            </div>

            <!-- Acciones -->
            <div class="mt-3 d-flex gap-2">
              <button class="btn btn-sm btn-outline-primary w-50" @click="abrirModalEditar(d)" data-bs-toggle="modal" data-bs-target="#destinoModal">
                <i class="bi bi-pencil"></i> Editar
              </button>
              <button class="btn btn-sm btn-outline-danger w-50" @click="abrirConfirmEliminar(d)" >
                <i class="bi bi-trash"></i> Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Si no hay destinos -->
      <div v-if="!destinos.length" class="col-12 text-center text-muted py-5">
        No hay destinos registrados.
      </div>
    </div>

    <!-- Modal Crear / Editar Destino -->
    <div class="modal fade" id="destinoModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <form class="modal-content" @submit.prevent="guardarDestino">
          <div class="modal-header">
            <h5 class="modal-title">{{ modoEdicion ? 'Editar Destino' : 'Nuevo Destino' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Ciudad</label>
                <input v-model="destinoActual.ciudad" type="text" class="form-control" required />
              </div>

              <div class="col-md-6">
                <label class="form-label">País</label>
                <input v-model="destinoActual.pais" type="text" class="form-control" required />
              </div>

              <div class="col-md-6">
                <label class="form-label">Duración</label>
                <input v-model="destinoActual.duracion" type="text" class="form-control" placeholder="Ej: 1h 10min" required />
              </div>

              <div class="col-md-6">
                <label class="form-label">Distancia (km)</label>
                <input v-model.number="destinoActual.distancia" type="number" class="form-control" required />
              </div>

              <div class="col-md-6">
                <label class="form-label">Avión</label>
                <input v-model="destinoActual.avion" type="text" class="form-control" />
              </div>

              <div class="col-md-6">
                <label class="form-label">Precio (COP)</label>
                <input v-model.number="destinoActual.precio" type="number" class="form-control" required />
              </div>

              <div class="col-12">
                <label class="form-label">Imagen (URL)</label>
                <input v-model="destinoActual.imagen" type="url" class="form-control" required />
              </div>

              <div class="col-12">
                <label class="form-label">Descripción</label>
                <textarea v-model="destinoActual.descripcion" class="form-control" rows="3"></textarea>
              </div>

              <div class="col-md-4">
                <label class="form-label">Escalas (número)</label>
                <input v-model.number="destinoActual.escalas" type="number" min="0" class="form-control" />
              </div>

              <div class="col-md-8">
                <label class="form-label">Ciudades de escala (separadas por coma)</label>
                <input v-model="escalasTexto" type="text" class="form-control" :placeholder="'Ej: Ciudad de México, Miami' " />
                <small class="text-muted">Solo necesario si Escalas &gt; 0</small>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="submit" class="btn btn-primary">{{ modoEdicion ? 'Actualizar' : 'Crear' }}</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Confirmar Eliminar -->
    <div class="modal fade" id="confirmEliminarModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-body text-center py-4">
            <h5 class="mb-3">¿Eliminar destino?</h5>
            <p class="text-muted mb-4">Esta acción no se puede deshacer.</p>
            <div class="d-flex justify-content-center gap-2">
              <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button class="btn btn-danger" @click="confirmarEliminar">Eliminar</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Modal } from 'bootstrap';
import { API_URLS } from '@/service/api.js';

// estados
const destinos = ref([]);
const cargando = ref(false);

const modoEdicion = ref(false);
const destinoActual = ref({
  id: null,
  ciudad: '',
  pais: '',
  distancia: 0,
  duracion: '',
  avion: '',
  escalas: 0,
  escalasCiudades: [],
  precio: 0,
  imagen: '',
  descripcion: ''
});

// para el input de escalas como texto
const escalasTexto = ref('');

// alerta
const alerta = ref({ visible: false, tipo: 'success', mensaje: '' });

// para eliminar
const destinoAEliminar = ref(null);

// helpers
const mostrarAlerta = (tipo, mensaje) => {
  alerta.value = { visible: true, tipo, mensaje };
  setTimeout(() => (alerta.value.visible = false), 3500);
};

const formatPrice = (v) => {
  try {
    return Number(v).toLocaleString('es-CO');
  } catch {
    return v;
  }
};

// cargar datos
const cargarDestinos = async () => {
  cargando.value = true;
  try {
    const res = await fetch(API_URLS.DESTINOS);
    const data = await res.json();
    if (Array.isArray(data)) {
      // asegurar estructura: escalasCiudades array
      destinos.value = data.map((x) => ({
        ...x,
        escalasCiudades: Array.isArray(x.escalasCiudades) ? x.escalasCiudades : (x.escalasCiudades ? x.escalasCiudades : [])
      }));
    } else {
      destinos.value = [];
    }
  } catch (e) {
    console.error('Error cargando destinos:', e);
    mostrarAlerta('danger', 'Fallo al cargar destinos desde la API');
    destinos.value = [];
  } finally {
    cargando.value = false;
  }
};

// abrir modal nuevo
const abrirModalNuevo = () => {
  modoEdicion.value = false;
  destinoActual.value = {
    id: null, ciudad: '', pais: '', distancia: 0, duracion: '', avion: '', escalas: 0, escalasCiudades: [], precio: 0, imagen: '', descripcion: ''
  };
  escalasTexto.value = '';
  // show modal (bootstrap attribute on button will open it)
};

// abrir modal editar
const abrirModalEditar = (d) => {
  modoEdicion.value = true;
  destinoActual.value = { ...d };
  escalasTexto.value = (Array.isArray(d.escalasCiudades) ? d.escalasCiudades.join(', ') : (d.escalasCiudades || '') );
};

// guardar (crear o actualizar)
const guardarDestino = async () => {
  try {
    // preparar escalasCiudades desde texto
    const ciudades = escalasTexto.value
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    destinoActual.value.escalasCiudades = destinoActual.value.escalas > 0 ? ciudades : [];

    if (modoEdicion.value && destinoActual.value.id) {
      const id = destinoActual.value.id;
      const payload = { ...destinoActual.value };
      const res = await fetch(`${API_URLS.DESTINOS}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Error actualizando destino');
      mostrarAlerta('success', 'Destino actualizado correctamente');
    } else {
      const payload = { ...destinoActual.value };
      const res = await fetch(API_URLS.DESTINOS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Error creando destino');
      mostrarAlerta('success', 'Destino creado correctamente');
    }

    // cerrar modal manualmente
    const modalEl = document.getElementById('destinoModal');
    const modal = Modal.getInstance(modalEl) || Modal.getOrCreateInstance(modalEl);
    if (modal) modal.hide();

    await cargarDestinos();
  } catch (e) {
    console.error(e);
    mostrarAlerta('danger', 'Error al guardar destino');
  }
};

// abrir confirm eliminar
const abrirConfirmEliminar = (d) => {
  destinoAEliminar.value = d;
  const modalEl = document.getElementById('confirmEliminarModal');
  const modal = Modal.getOrCreateInstance(modalEl);
  modal.show();
};

// confirmar eliminar
const confirmarEliminar = async () => {
  if (!destinoAEliminar.value) return;
  try {
    const id = destinoAEliminar.value.id;
    const res = await fetch(`${API_URLS.DESTINOS}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error eliminando destino');
    mostrarAlerta('success', 'Destino eliminado correctamente');

    // cerrar confirm
    const modalEl = document.getElementById('confirmEliminarModal');
    const modal = Modal.getInstance(modalEl);
    if (modal) modal.hide();

    await cargarDestinos();
  } catch (e) {
    console.error(e);
    mostrarAlerta('danger', 'Error al eliminar destino');
  } finally {
    destinoAEliminar.value = null;
  }
};

onMounted(() => {
  cargarDestinos();
});
</script>

<style scoped>
.destinos-view {
  padding: 1rem;
}

/* Card visuals */
.destino-card {
  border-radius: 0.75rem;
  overflow: hidden;
  transition: transform 0.25s, box-shadow 0.25s;
}
.destino-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.12);
}
.destino-img {
  height: 170px;
  width: 100%;
  object-fit: cover;
  display: block;
}

/* small text truncation 3 lines */
.text-truncate-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* price badge */
.text-primary { color: #0d6efd !important; }

/* responsive spacing */
@media (max-width: 768px) {
  .destino-img { height: 150px; }
}
</style>
