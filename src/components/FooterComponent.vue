<template>
  <footer class="footer bg-dark text-white py-4 mt-auto">
    <div class="container">
      <div class="row">
        <div class="col-md-6 text-center text-md-start">
          <p class="mb-0">
            &copy; {{ añoActual }} TravelNow. Todos los derechos reservados.
          </p>
        </div>
        <div class="col-md-6 text-center text-md-end">
          <a href="https://www.facebook.com/share/1aqJ9y7Tfx/" class="text-white me-3 text-decoration-none">
            <i class="bi bi-facebook"></i>
          </a>
          <a href="https://www.instagram.com/why_josuek?igsh=bnV6Z3drZGRobzJs" class="text-white me-3 text-decoration-none">
            <i class="bi bi-instagram"></i>
          </a>
          <a href="#" class="text-white text-decoration-none">
            <i class="bi bi-twitter"></i>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue';

const añoActual = ref(new Date().getFullYear());
</script>

<style scoped>
.footer {
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
}

.footer a:hover {
  opacity: 0.8;
}
</style>