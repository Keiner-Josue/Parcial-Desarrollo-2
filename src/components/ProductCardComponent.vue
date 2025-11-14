<template>
  <div class="product-card">
    <img :src="imagen" :alt="nombre" />
    <div class="product-content">
      <h3>{{ nombre }}</h3>
      <p class="description">{{ descripcion }}</p>
      <p class="price">{{ precioFormateado }}</p>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'ProductCardComponent',
  props: {
    nombre: {
      type: String,
      required: true
    },
    precio: {
      type: [Number, String],
      required: true
    },
    descripcion: {
      type: String,
      default: ''
    },
    imagen: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const precioFormateado = computed(() => {
      if (typeof props.precio === 'number') {
        return `$${props.precio.toLocaleString('es-CO')} COP`;
      }
      return props.precio;
    });

    return {
      precioFormateado
    };
  }
};
</script>

<style scoped>
.product-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
}

.product-card img {
  width: 100%;
  height: 240px;
  object-fit: cover;
  transition: transform 0.5s;
}

.product-card:hover img {
  transform: scale(1.1);
}

.product-content {
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.product-content h3 {
  color: #1a1d3a;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.description {
  color: #64748b;
  line-height: 1.6;
  flex-grow: 1;
  margin-bottom: 1rem;
}

.price {
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(124, 58, 237, 0.1));
  color: #7c3aed;
  font-size: 1.5rem;
  font-weight: 800;
  text-align: center;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-top: auto;
}
</style>