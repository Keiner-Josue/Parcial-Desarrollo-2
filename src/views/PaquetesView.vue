<template>
  <div class="paquetes-container">
    <h1>📦 Gestión de Productos</h1>

    <button class="btn-crear" @click="nuevoProducto">➕ Crear Producto</button>

    <!-- FORMULARIO -->
    <div v-if="showForm" class="form-card">
      <h2>{{ editMode ? "Editar Producto" : "Crear Producto" }}</h2>

      <form @submit.prevent="guardarProducto">
        <label>Nombre</label>
        <input v-model="form.nombre" required />

        <label>Descripción</label>
        <input v-model="form.descripcion" required />

        <label>Precio</label>
        <input v-model="form.precio" type="number" required />

        <label>Imagen (URL)</label>
        <input v-model="form.imagen" required />

        <div class="buttons">
          <button type="submit" class="btn-save">Guardar</button>
          <button type="button" class="btn-cancel" @click="cancelar">Cancelar</button>
        </div>
      </form>
    </div>

    <!-- TABLA -->
    <table class="tabla">
      <thead>
        <tr>
          <th>Imagen</th>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="producto in productos" :key="producto.id">
          <td><img :src="producto.imagen" class="img-tabla" /></td>
          <td>{{ producto.nombre }}</td>
          <td>${{ producto.precio }}</td>
          <td>
            <button class="btn-edit" @click="editarProducto(producto)">✏</button>
            <button class="btn-delete" @click="eliminarProducto(producto.id)">🗑</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { API_URLS } from "@/service/api.js";

const productos = ref([]);
const showForm = ref(false);
const editMode = ref(false);

const form = ref({
  id: null,
  nombre: "",
  descripcion: "",
  precio: "",
  imagen: ""
});

// 🔥 1 — Cargar productos desde la API
const cargarProductos = async () => {
  const res = await fetch(API_URLS.PRODUCTOS);
  productos.value = await res.json();
};

onMounted(() => cargarProductos());

// 🔥 2 — Crear un producto
const nuevoProducto = () => {
  showForm.value = true;
  editMode.value = false;
  form.value = { id: null, nombre: "", descripcion: "", precio: "", imagen: "" };
};

// 🔥 3 — Editar un producto
const editarProducto = (p) => {
  showForm.value = true;
  editMode.value = true;
  form.value = { ...p };
};

// 🔥 4 — Guardar (crear o actualizar)
const guardarProducto = async () => {
  if (editMode.value) {
    // EDITAR
    await fetch(`${API_URLS.PRODUCTOS}/${form.value.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form.value)
    });
  } else {
    // CREAR
    await fetch(API_URLS.PRODUCTOS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form.value)
    });
  }

  showForm.value = false;
  await cargarProductos(); // refrescar
};

// 🔥 5 — Eliminar
const eliminarProducto = async (id) => {
  if (!confirm("¿Eliminar este producto?")) return;

  await fetch(`${API_URLS.PRODUCTOS}/${id}`, {
    method: "DELETE"
  });

  await cargarProductos();
};

const cancelar = () => {
  showForm.value = false;
};
</script>

<style scoped>
.paquetes-container {
  padding: 20px;
}

.btn-crear {
  background: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 20px;
}

.form-card {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.form-card label {
  font-weight: bold;
  display: block;
  margin-top: 10px;
}

.form-card input {
  width: 100%;
  padding: 8px;
  margin: 5px 0;
}

.buttons {
  margin-top: 15px;
}

.btn-save {
  background: #2196f3;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-cancel {
  background: #aaa;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 6px;
  margin-left: 10px;
  cursor: pointer;
}

.tabla {
  width: 100%;
  border-collapse: collapse;
}

.tabla th, .tabla td {
  padding: 12px;
  border-bottom: 1px solid #ddd;
}

.img-tabla {
  width: 60px;
  border-radius: 6px;
}

.btn-edit {
  background: #ffb300;
  padding: 6px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-delete {
  background: #e53935;
  padding: 6px;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
}
</style>
