import { API_URLS } from './api.js';

export const usuariosAPI = {
  async obtenerTodos() {
    const res = await fetch(API_URLS.USUARIOS);
    if (!res.ok) throw new Error('Error obteniendo usuarios');
    return res.json();
  },

  async crear(data) {
    const res = await fetch(API_URLS.USUARIOS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error creando usuario');
    return res.json();
  },

  async actualizar(id, data) {
    const res = await fetch(`${API_URLS.USUARIOS}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error actualizando usuario');
    return res.json();
  },

  async eliminar(id) {
    const res = await fetch(`${API_URLS.USUARIOS}/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Error eliminando usuario');
    return true;
  }
};
