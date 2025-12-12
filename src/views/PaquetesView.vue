<template>
  <div class="paquetes-view">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">
        <i class="bi bi-suitcase-lg me-2"></i>
        Gestión de Paquetes Turísticos
      </h2>
      <button 
        class="btn btn-primary" 
        data-bs-toggle="modal" 
        data-bs-target="#paqueteModal"
        @click="abrirModalNuevo"
      >
        <i class="bi bi-plus-circle me-2"></i>
        Nuevo Paquete
      </button>
    </div>

    <!-- Alerta de éxito/error -->
    <div 
      v-if="alerta.visible" 
      :class="`alert alert-${alerta.tipo} alert-dismissible fade show`" 
      role="alert"
    >
      {{ alerta.mensaje }}
      <button 
        type="button" 
        class="btn-close" 
        @click="alerta.visible = false"
      ></button>
    </div>

    <!-- Loading spinner -->
    <div v-if="cargando" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <!-- Tabla de paquetes -->
    <div v-else class="card shadow-sm">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead class="table-light">
              <tr>
                <th>ID</th>
                <th>Imagen</th>
                <th>Título</th>
                <th>Descripción</th>
                <th>Precio (COP)</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="paquete in paquetes" :key="paquete.id">
                <td>{{ paquete.id }}</td>
                <td>
                  <img 
                    :src="paquete.imagen" 
                    :alt="paquete.titulo" 
                    style="width: 60px; height: 60px; object-fit: cover; border-radius: 0.5rem;"
                  />
                </td>
                <td class="fw-semibold">{{ paquete.titulo }}</td>
                <td class="text-muted small">{{ paquete.descripcion }}</td>
                <td class="fw-bold text-success">
                  ${{ paquete.precio.toLocaleString('es-CO') }}
                </td>
                <td>
                  <button 
                    class="btn btn-sm btn-outline-primary me-2"
                    @click="abrirModalEditar(paquete)"
                    data-bs-toggle="modal" 
                    data-bs-target="#paqueteModal"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button 
                    class="btn btn-sm btn-outline-danger"
                    @click="eliminarPaquete(paquete.id)"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal para crear/editar paquete -->
    <div 
      class="modal fade" 
      id="paqueteModal" 
      tabindex="-1"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ modoEdicion ? 'Editar Paquete' : 'Nuevo Paquete' }}
            </h5>
            <button 
              type="button" 
              class="btn-close" 
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="guardarPaquete">
              <div class="mb-3">
                <label class="form-label">Título del Paquete</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="paqueteActual.titulo"
                  placeholder="Ej: Paquete Cancún 5 días"
                  required
                />
              </div>
              
              <div class="mb-3">
                <label class="form-label">Descripción</label>
                <textarea 
                  class="form-control" 
                  v-model="paqueteActual.descripcion"
                  rows="3"
                  placeholder="Describe el paquete turístico"
                  required
                ></textarea>
              </div>
              
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Precio (COP)</label>
                  <input 
                    type="number" 
                    class="form-control" 
                    v-model="paqueteActual.precio"
                    placeholder="4800000"
                    required
                  />
                </div>
                
                <div class="col-md-6 mb-3">
                  <label class="form-label">URL de Imagen</label>
                  <input 
                    type="url" 
                    class="form-control" 
                    v-model="paqueteActual.imagen"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <!-- Preview de imagen -->
              <div v-if="paqueteActual.imagen" class="mb-3">
                <label class="form-label">Vista previa</label>
                <div class="text-center">
                  <img 
                    :src="paqueteActual.imagen" 
                    alt="Preview" 
                    class="img-thumbnail"
                    style="max-height: 200px;"
                  />
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              data-bs-dismiss="modal"
            >
              Cancelar
            </button>
            <button 
              type="button" 
              class="btn btn-primary"
              @click="guardarPaquete"
            >
              <i class="bi bi-save me-2"></i>
              {{ modoEdicion ? 'Actualizar' : 'Guardar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { Modal } from 'bootstrap';
import { API_URLS } from '@/service/api.js';

export default {
  name: 'PaquetesView',
  setup() {
    const paquetes = ref([]);
    const cargando = ref(false);
    const modoEdicion = ref(false);
    const paqueteActual = ref({
      titulo: '',
      precio: 0,
      descripcion: '',
      imagen: ''
    });

    const alerta = ref({
      visible: false,
      tipo: 'success',
      mensaje: ''
    });

    const cargarPaquetes = async () => {
      cargando.value = true;
      try {
        const response = await fetch(API_URLS.PRODUCTOS);
        const data = await response.json();
        // API may return an array or an object with `paquetes`.
        if (Array.isArray(data)) {
          paquetes.value = data;
        } else if (data && Array.isArray(data.paquetes)) {
          paquetes.value = data.paquetes;
        } else {
          paquetes.value = [];
        }
      } catch (error) {
        mostrarAlerta('danger', 'Error al cargar paquetes');
        console.error(error);
      } finally {
        cargando.value = false;
      }
    };

    const abrirModalNuevo = () => {
      modoEdicion.value = false;
      paqueteActual.value = {
        titulo: '',
        precio: 0,
        descripcion: '',
        imagen: ''
      };
    };

    const abrirModalEditar = (paquete) => {
      modoEdicion.value = true;
      paqueteActual.value = { ...paquete };
    };

    const guardarPaquete = () => {
      try {
        if (modoEdicion.value) {
          // Actualizar paquete existente
          const index = paquetes.value.findIndex(p => p.id === paqueteActual.value.id);
          if (index !== -1) {
            paquetes.value[index] = { ...paqueteActual.value };
          }
          mostrarAlerta('success', 'Paquete actualizado correctamente');
        } else {
          // Crear nuevo paquete
          const nuevoId = Math.max(...paquetes.value.map(p => p.id), 0) + 1;
          const nuevoPaquete = {
            id: nuevoId,
            ...paqueteActual.value
          };
          paquetes.value.unshift(nuevoPaquete);
          mostrarAlerta('success', 'Paquete creado correctamente');
        }

        cerrarModal();
      } catch (error) {
        mostrarAlerta('danger', 'Error al guardar paquete');
        console.error(error);
      }
    };

    const eliminarPaquete = (id) => {
      if (!confirm('¿Estás seguro de eliminar este paquete?')) return;

      try {
        paquetes.value = paquetes.value.filter(p => p.id !== id);
        mostrarAlerta('success', 'Paquete eliminado correctamente');
      } catch (error) {
        mostrarAlerta('danger', 'Error al eliminar paquete');
        console.error(error);
      }
    };

    const mostrarAlerta = (tipo, mensaje) => {
      alerta.value = { visible: true, tipo, mensaje };
      setTimeout(() => {
        alerta.value.visible = false;
      }, 3000);
    };

    const cerrarModal = () => {
      const modalEl = document.getElementById('paqueteModal');
      const modal = Modal.getInstance(modalEl);
      if (modal) modal.hide();
    };

    onMounted(() => {
      cargarPaquetes();
    });

    return {
      paquetes,
      cargando,
      modoEdicion,
      paqueteActual,
      alerta,
      abrirModalNuevo,
      abrirModalEditar,
      guardarPaquete,
      eliminarPaquete
    };
  }
};
</script>

<style scoped>
.paquetes-view {
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

.table th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
}

.modal-lg {
  max-width: 700px;
}
</style>