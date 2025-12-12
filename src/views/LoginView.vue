<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>🌍 TravelNow</h1>
        <p>Inicia sesión para continuar</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="usuario">Usuario</label>
          <input
            type="text"
            id="usuario"
            v-model="credentials.usuario"
            placeholder="Ingresa tu usuario"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input
            type="password"
            id="password"
            v-model="credentials.contraseña"
            placeholder="Ingresa tu contraseña"
            required
          />
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <button type="submit" class="btn-login" :disabled="loading">
          {{ loading ? 'Verificando...' : 'Iniciar Sesión' }}
        </button>
      </form>

      <div class="login-info">
        <p><strong>Usuario de prueba:</strong>admin</p>
        <p><strong>Contraseña:</strong>admin123</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { API_URLS } from '@/service/api.js';
import { useRouter } from 'vue-router';

const router = useRouter();
const credentials = ref({ usuario: '', contraseña: '' });
const errorMessage = ref('');
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    const response = await fetch(API_URLS.USUARIOS);
    if (!response.ok) throw new Error('No se pudo conectar a la API de usuarios');
    const usuarios = await response.json();

    // Validación: tu mock usa email/password OR name/password?
    // En tus datos anteriores usabas 'email' y 'password'.
    const usuarioValido = usuarios.find(
      u =>
        (u.email && u.email === credentials.value.usuario) ||
        (u.name && u.name === credentials.value.usuario) ||
        (u.usuario && u.usuario === credentials.value.usuario)
    );

    // si existe, ahora validar la contraseña
    if (!usuarioValido) {
      errorMessage.value = '❌ Usuario no encontrado';
      loading.value = false;
      return;
    }

    // comparar contraseña (keys posibles: password o contraseña)
    const pwdKey = usuarioValido.password !== undefined ? 'password' : (usuarioValido.contraseña !== undefined ? 'contraseña' : null);
    if (!pwdKey || usuarioValido[pwdKey] !== credentials.value.contraseña) {
      errorMessage.value = '❌ Usuario o contraseña incorrectos';
      loading.value = false;
      return;
    }

    // guardar sesión: isAuthenticated + user (json) + usuario (compatibilidad)
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(usuarioValido));
    // guarda también 'usuario' (string) para compatibilidad con código antiguo:
    localStorage.setItem('usuario', usuarioValido.name || usuarioValido.nombre || usuarioValido.email || usuarioValido.usuario || '');

    router.push('/dashboard');
  } catch (e) {
    console.error('Error en login:', e);
    errorMessage.value = '❌ Error al conectar con el servidor';
  } finally {
    loading.value = false;
  }
};
</script>



<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1d3a 0%, #2d3561 100%);
  padding: 1rem;
}

.login-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 450px;
  width: 100%;
  overflow: hidden;
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  background: linear-gradient(135deg, #00d4ff, #7c3aed);
  color: white;
  padding: 2rem;
  text-align: center;
}

.login-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.login-header p {
  opacity: 0.9;
  font-size: 0.95rem;
}

.login-form {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #1a1d3a;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #00d4ff;
  box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  font-weight: 600;
}

.btn-login {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #00d4ff, #7c3aed);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 212, 255, 0.4);
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-info {
  background: #f8fafc;
  padding: 1.5rem 2rem;
  border-top: 1px solid #e2e8f0;
  font-size: 0.85rem;
  color: #64748b;
}

.login-info p {
  margin-bottom: 0.25rem;
}
</style>