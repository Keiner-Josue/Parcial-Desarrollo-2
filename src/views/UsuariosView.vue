<template>
  <div class="usuarios-view">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">
        <i class="bi bi-people me-2"></i>
        Gestión de Usuarios
      </h2>

      <button 
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#usuarioModal"
        @click="abrirModalNuevo"
      >
        <i class="bi bi-plus-circle me-2"></i>
        Nuevo Usuario
      </button>
    </div>

    <!-- Alertas -->
    <div v-if="alerta.visible" :class="`alert alert-${alerta.tipo} alert-dismissible fade show`" role="alert">
      {{ alerta.mensaje }}
      <button type="button" class="btn-close" @click="alerta.visible = false"></button>
    </div>

    <!-- Tabla -->
    <div v-if="cargando" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else class="card shadow-sm">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="u in usuarios" :key="u.id">
                <td>{{ u.id }}</td>
                <td class="fw-semibold">{{ u.usuario }}</td>
                <td>{{ u.nombre }}</td>
                <td>{{ u.email }}</td>
                <td>{{ u.rol || '-' }}</td>
                <td>
                  <button class="btn btn-sm btn-outline-primary me-2"
                          @click="abrirModalEditar(u)"
                          data-bs-toggle="modal"
                          data-bs-target="#usuarioModal">
                    <i class="bi bi-pencil"></i>
                  </button>

                  <button class="btn btn-sm btn-outline-danger"
                          @click="abrirConfirmEliminar(u)">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>

              <tr v-if="usuarios.length === 0">
                <td colspan="6" class="text-center text-muted">No hay usuarios</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Crear / Editar -->
    <div class="modal fade" id="usuarioModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <form @submit.prevent="guardarUsuario" class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ modoEdicion ? 'Editar Usuario' : 'Nuevo Usuario' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Usuario</label>
              <input v-model="usuarioActual.usuario" type="text" class="form-control" required />
            </div>

            <div class="mb-3">
              <label class="form-label">Contraseña</label>
              <input v-model="usuarioActual.contraseña" type="password" class="form-control" :required="!modoEdicion" />
              <small class="text-muted">Si deja vacío al editar, la contraseña no cambiará.</small>
            </div>

            <div class="mb-3">
              <label class="form-label">Nombre</label>
              <input v-model="usuarioActual.nombre" type="text" class="form-control" />
            </div>

            <div class="mb-3">
              <label class="form-label">Email</label>
              <input v-model="usuarioActual.email" type="email" class="form-control" />
            </div>

            <div class="mb-3">
              <label class="form-label">Rol</label>
              <input v-model="usuarioActual.rol" type="text" class="form-control" placeholder="admin / user" />
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
            <h5 class="mb-3">¿Eliminar usuario?</h5>
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

<script>
import { ref, onMounted } from 'vue';
import { Modal } from 'bootstrap';
import { usuariosAPI } from '@/service/usuarios.js';

export default {
  name: 'UsuariosView',
  setup() {
    const usuarios = ref([]);
    const cargando = ref(false);

    const modoEdicion = ref(false);
    const usuarioActual = ref({
      usuario: '',
      contraseña: '',
      nombre: '',
      email: '',
      rol: ''
    });

    const alerta = ref({
      visible: false,
      tipo: 'success',
      mensaje: ''
    });

    const usuarioAEliminar = ref(null);

    const mostrarAlerta = (tipo, mensaje) => {
      alerta.value = { visible: true, tipo, mensaje };
      setTimeout(() => (alerta.value.visible = false), 3000);
    };

    const cargarUsuarios = async () => {
      cargando.value = true;
      try {
        usuarios.value = await usuariosAPI.obtenerTodos();
      } catch (e) {
        mostrarAlerta('danger', 'Error al cargar usuarios');
      } finally {
        cargando.value = false;
      }
    };

    const abrirModalNuevo = () => {
      modoEdicion.value = false;
      usuarioActual.value = { usuario: '', contraseña: '', nombre: '', email: '', rol: '' };
    };

    const abrirModalEditar = (u) => {
      modoEdicion.value = true;
      usuarioActual.value = { ...u, contraseña: '' };
    };

    const guardarUsuario = async () => {
      try {
        const payload = { ...usuarioActual.value };

        if (modoEdicion.value) {
          const id = usuarioActual.value.id;
          if (!payload.contraseña) delete payload.contraseña;

          await usuariosAPI.actualizar(id, payload);
          mostrarAlerta('success', 'Usuario actualizado');
        } else {
          await usuariosAPI.crear(payload);
          mostrarAlerta('success', 'Usuario creado');
        }

        const modal = Modal.getInstance(document.getElementById('usuarioModal'));
        modal.hide();
        await cargarUsuarios();
      } catch (e) {
        mostrarAlerta('danger', 'Error al guardar usuario');
      }
    };

    const abrirConfirmEliminar = (u) => {
      usuarioAEliminar.value = u;
      const modal = new Modal(document.getElementById('confirmEliminarModal'));
      modal.show();
    };

    const confirmarEliminar = async () => {
      try {
        await usuariosAPI.eliminar(usuarioAEliminar.value.id);

        const modal = Modal.getInstance(document.getElementById('confirmEliminarModal'));
        modal.hide();

        mostrarAlerta('success', 'Usuario eliminado');
        await cargarUsuarios();
      } catch (e) {
        mostrarAlerta('danger', 'Error eliminando usuario');
      }
    };

    onMounted(() => cargarUsuarios());

    return {
      usuarios,
      cargando,
      modoEdicion,
      usuarioActual,
      alerta,
      abrirModalNuevo,
      abrirModalEditar,
      guardarUsuario,
      abrirConfirmEliminar,
      confirmarEliminar
    };
  }
};
</script>

<style scoped>
.usuarios-view {
  animation: fadeIn 0.5s;
}
.table th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
}
</style>
