<template>
  <div class="flota-view">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">
        <i class="bi bi-airplane me-2"></i>
        Nuestra Flota
      </h2>

      <button class="btn btn-primary" @click="abrirModalNuevo" data-bs-toggle="modal" data-bs-target="#flotaModal">
        <i class="bi bi-plus-circle me-2"></i> Nuevo Vehículo
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
      <div class="col-md-6 col-lg-4" v-for="a in flota" :key="a.id">
        <div class="card h-100 shadow-sm">
          <img :src="a.imagen" :alt="a.nombre" class="card-img-top flota-img" />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ a.nombre }}</h5>

            <div class="mb-2 text-muted small">
              <div><i class="bi bi-people me-1"></i> Capacidad: {{ a.capacidad }}</div>
              <div><i class="bi bi-info-circle me-1"></i> En servicio: {{ formatEnServicio(a['En servicio'] ?? a.enServicio) }}</div>
            </div>

            <p class="card-text small text-truncate-3">{{ a.descripcion }}</p>

            <div class="mt-3">
              <h6 class="text-uppercase text-muted mb-2" style="font-size: 0.8rem;">Servicios incluidos</h6>
              <ul class="list-unstyled mb-0">
                <li v-for="(s, idx) in a.servicios || []" :key="idx" class="mb-1">
                  <i class="bi bi-check-circle-fill text-success me-2"></i>{{ s }}
                </li>
                <li v-if="!a.servicios || a.servicios.length === 0" class="text-muted">— Ninguno registrado —</li>
              </ul>
            </div>

            <div class="mt-3 d-flex gap-2">
              <button class="btn btn-sm btn-outline-primary w-50" @click="abrirModalEditar(a)" data-bs-toggle="modal" data-bs-target="#flotaModal">
                <i class="bi bi-pencil"></i> Editar
              </button>
              <button class="btn btn-sm btn-outline-danger w-50" @click="abrirConfirmEliminar(a)">
                <i class="bi bi-trash"></i> Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!flota.length" class="col-12 text-center text-muted py-5">
        No hay vehículos en la flota.
      </div>
    </div>

    <!-- Modal Crear / Editar Flota -->
    <div class="modal fade" id="flotaModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <form class="modal-content" @submit.prevent="guardarFlota">
          <div class="modal-header">
            <h5 class="modal-title">{{ modoEdicion ? 'Editar Vehículo' : 'Nuevo Vehículo' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Nombre</label>
                <input v-model="vehiculoActual.nombre" type="text" class="form-control" required />
              </div>

              <div class="col-md-6">
                <label class="form-label">Capacidad</label>
                <input v-model.number="vehiculoActual.capacidad" type="number" class="form-control" required />
              </div>

              <div class="col-md-6">
                <label class="form-label">En servicio (sí/no)</label>
                <select v-model="vehiculoActual['En servicio']" class="form-select">
                  <option :value="true">Sí</option>
                  <option :value="false">No</option>
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label">Imagen (URL)</label>
                <input v-model="vehiculoActual.imagen" type="url" class="form-control" />
              </div>

              <div class="col-12">
                <label class="form-label">Descripción</label>
                <textarea v-model="vehiculoActual.descripcion" class="form-control" rows="3"></textarea>
              </div>

              <div class="col-12">
                <label class="form-label">Servicios (separados por coma)</label>
                <input v-model="serviciosTexto" type="text" class="form-control" placeholder="Ej: WiFi, Snacks, Entretenimiento" />
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
    <div class="modal fade" id="confirmEliminarFlotaModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-body text-center py-4">
            <h5 class="mb-3">¿Eliminar vehículo?</h5>
            <p class="text-muted mb-4">Esta acción no se puede deshacer.</p>
            <div class="d-flex justify-content-center gap-2">
              <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button class="btn btn-danger" @click="confirmarEliminarFlota">Eliminar</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Modal } from 'bootstrap';
import { API_URLS } from '@/service/api.js';

const flota = ref([]);
const cargando = ref(false);

const modoEdicion = ref(false);
const vehiculoActual = ref({
  id: null,
  nombre: '',
  capacidad: 0,
  'En servicio': true,
  imagen: '',
  descripcion: '',
  servicios: []
});

const serviciosTexto = ref('');
const alerta = ref({ visible: false, tipo: 'success', mensaje: '' });
const vehiculoAEliminar = ref(null);

const mostrarAlerta = (tipo, mensaje) => {
  alerta.value = { visible: true, tipo, mensaje };
  setTimeout(() => (alerta.value.visible = false), 3500);
};

const parseServiciosFromText = (text) =>
  text
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

// formatea el campo En servicio para mostrarlo bonito
const formatEnServicio = (val) => {
  if (val === true || val === 'true' || val === 1 || val === '1') return 'Sí';
  if (val === false || val === 'false' || val === 0 || val === '0') return 'No';
  return String(val ?? '-');
};

// Cargar flota desde API
const cargarFlota = async () => {
  cargando.value = true;
  try {
    const res = await fetch(API_URLS.FLOTA);
    const data = await res.json();
    if (Array.isArray(data)) {
      // Normalizar servicios a array
      flota.value = data.map(x => ({
        ...x,
        servicios: Array.isArray(x.servicios) ? x.servicios : (x.servicios ? (typeof x.servicios === 'string' ? x.servicios.split(',').map(s=>s.trim()).filter(Boolean) : []) : [])
      }));
    } else {
      flota.value = [];
    }
  } catch (e) {
    console.error('Error cargando flota:', e);
    mostrarAlerta('danger', 'Error al cargar flota desde la API');
    flota.value = [];
  } finally {
    cargando.value = false;
  }
};

onMounted(() => cargarFlota());

// Abrir modal nuevo
const abrirModalNuevo = () => {
  modoEdicion.value = false;
  vehiculoActual.value = { id: null, nombre: '', capacidad: 0, 'En servicio': true, imagen: '', descripcion: '', servicios: [] };
  serviciosTexto.value = '';
};

// Abrir modal editar
const abrirModalEditar = (v) => {
  modoEdicion.value = true;
  // normalizar nombre del campo 'En servicio' (algunos datos lo usaban así)
  const enServicioVal = v['En servicio'] ?? v.enServicio ?? true;
  vehiculoActual.value = {
    ...v,
    'En servicio': enServicioVal,
    servicios: Array.isArray(v.servicios) ? v.servicios : (v.servicios ? (typeof v.servicios === 'string' ? v.servicios.split(',').map(s=>s.trim()).filter(Boolean) : []) : [])
  };
  serviciosTexto.value = (vehiculoActual.value.servicios || []).join(', ');
};

// Guardar vehículo (crear / actualizar)
const guardarFlota = async () => {
  try {
    const serviciosArr = parseServiciosFromText(serviciosTexto.value);
    vehiculoActual.value.servicios = serviciosArr;

    if (modoEdicion.value && vehiculoActual.value.id) {
      const id = vehiculoActual.value.id;
      const payload = { ...vehiculoActual.value };
      const res = await fetch(`${API_URLS.FLOTA}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Error actualizando vehículo');
      mostrarAlerta('success', 'Vehículo actualizado correctamente');
    } else {
      const payload = { ...vehiculoActual.value };
      const res = await fetch(API_URLS.FLOTA, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Error creando vehículo');
      mostrarAlerta('success', 'Vehículo creado correctamente');
    }

    // cerrar modal
    const modalEl = document.getElementById('flotaModal');
    const modal = Modal.getInstance(modalEl) || Modal.getOrCreateInstance(modalEl);
    if (modal) modal.hide();

    await cargarFlota();
  } catch (e) {
    console.error(e);
    mostrarAlerta('danger', 'Error al guardar vehículo');
  }
};

// abrir confirm eliminar
const abrirConfirmEliminar = (v) => {
  vehiculoAEliminar.value = v;
  const modalEl = document.getElementById('confirmEliminarFlotaModal');
  const modal = Modal.getOrCreateInstance(modalEl);
  modal.show();
};

// confirmar eliminar
const confirmarEliminarFlota = async () => {
  if (!vehiculoAEliminar.value) return;
  try {
    const id = vehiculoAEliminar.value.id;
    const res = await fetch(`${API_URLS.FLOTA}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error eliminando vehículo');
    mostrarAlerta('success', 'Vehículo eliminado correctamente');

    const modalEl = document.getElementById('confirmEliminarFlotaModal');
    const modal = Modal.getInstance(modalEl);
    if (modal) modal.hide();

    await cargarFlota();
  } catch (e) {
    console.error(e);
    mostrarAlerta('danger', 'Error al eliminar vehículo');
  } finally {
    vehiculoAEliminar.value = null;
  }
};
</script>

<style scoped>
.flota-img {
  height: 200px;
  object-fit: cover;
}

/* truncate text 3 lines */
.text-truncate-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card {
  transition: transform 0.25s, box-shadow 0.25s;
}
.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.12);
}
</style>
