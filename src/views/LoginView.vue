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
        <p><strong>Usuario de prueba:</strong> admin</p>
        <p><strong>Contraseña:</strong> admin123</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const credentials = ref({
  usuario: '',
  contraseña: ''
});
const errorMessage = ref('');
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    const response = await fetch('/data/usuarios.json');
    const usuarios = await response.json();

    const usuarioValido = usuarios.find(
      u => u.usuario === credentials.value.usuario && 
           u.contraseña === credentials.value.contraseña
    );

    if (usuarioValido) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('usuario', credentials.value.usuario);
      router.push('/dashboard');
    } else {
      errorMessage.value = '❌ Usuario o contraseña incorrectos';
    }
  } catch (error) {
    console.error('Error al validar credenciales:', error);
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