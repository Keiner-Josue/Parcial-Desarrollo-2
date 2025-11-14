# TravelNow - Aplicación Web Modularizada con Vue.js

## 📖 Descripción
TravelNow es una aplicación web modular desarrollada con Vue.js 3 y Bootstrap 5.3 que simula una agencia de viajes. El proyecto implementa buenas prácticas de desarrollo, componentización y consumo de APIs externas.

## 🏗️ Arquitectura y Modularización

### ¿Qué es la modularización?
La modularización es una técnica de desarrollo que consiste en dividir una aplicación en partes más pequeñas e independientes llamadas módulos o componentes. Cada módulo tiene una responsabilidad específica y puede ser reutilizado en diferentes partes de la aplicación.

**Beneficios:**
- ✅ Código más organizado y mantenible
- ✅ Reutilización de componentes
- ✅ Facilita el trabajo en equipo
- ✅ Mejora la escalabilidad del proyecto
- ✅ Facilita las pruebas y el debugging

### Estructura del Proyecto
```
src/
├── assets/          # Recursos estáticos (logos, estilos personalizados)
├── components/      # Componentes reutilizables
│   ├── NavbarComponent.vue
│   ├── SidebarComponent.vue
│   ├── FooterComponent.vue
│   └── ProductCardComponent.vue
├── views/           # Vistas de la aplicación
│   ├── LoginView.vue
│   ├── DashboardView.vue
│   ├── ProductoView.vue
│   ├── FlotaView.vue
│   └── DestinosView.vue
├── router/          # Configuración de rutas
├── service/         # Servicios para consumo de APIs
└── data/            # Datos locales (JSON)
```

## 🔑 Sistema de Autenticación

### Implementación del Login
El sistema de login implementado es **solo con fines educativos** y **NO debe usarse en aplicación reales** por las siguientes razones:

1. **Credenciales en texto plano**: Las contraseñas se almacenan sin encriptación
2. **Sin backend real**: La validación se hace del lado del cliente
3. **LocalStorage inseguro**: Los tokens de sesión se guardan en localStorage

**Credenciales de prueba:**
- Usuario: `admin`
- Contraseña: `admin123`

### ¿Cómo funciona?
1. El usuario ingresa credenciales en `LoginView.vue`
2. Se validan contra el archivo `data/usuarios.json`
3. Si son correctas, se guarda un flag en localStorage
4. El router protege las rutas mediante un guard

## 🧩 Componentes Web

### Fragmentos Reutilizables
Los fragmentos son componentes Vue que se cargan dinámicamente y se mantienen consistentes en toda la aplicación:

- **NavbarComponent**: Barra de navegación superior
- **SidebarComponent**: Menú lateral con rutas
- **FooterComponent**: Pie de página

### Web Components
**ProductCardComponent** es un componente reutilizable que recibe props y muestra información de productos de forma consistente.

**Props que recibe:**
```javascript
- nombre: String
- precio: Number | String
- descripcion: String
- imagen: String
```

## 📡 Consumo de API Externa

### API Utilizada
**FakeStore API**: https://fakestoreapi.com

### Operaciones CRUD
```javascript
GET    /products       → Listar todos los productos
GET    /products/1     → Obtener un producto específico
POST   /products       → Crear nuevo producto
PUT    /products/1     → Actualizar producto
DELETE /products/1     → Eliminar producto
```

### Servicio API (`service/api.js`)
Se creó un servicio centralizado para manejar todas las peticiones HTTP, facilitando el mantenimiento y la reutilización del código.

## 🎨 Estilos y Bootstrap

### Paleta de Colores
- **Primario**: #0d6efd (Azul Bootstrap)
- **Secundario**: #6c757d (Gris)
- **Éxito**: #198754 (Verde)
- **Información**: #0dcaf0 (Cyan)

### Clases Bootstrap Utilizadas
- Sistema de Grid responsive
- Componentes: Cards, Modals, Alerts, Badges, Tables
- Utilidades: spacing, typography, colors

## 🛠️ Buenas Prácticas Aplicadas

### Nomenclatura
- **camelCase**: Variables y funciones JavaScript
```javascript
  const nombreUsuario = 'admin';
  function cargarProductos() {}
```

- **PascalCase**: Nombres de componentes Vue
```javascript
  ProductCardComponent.vue
  NavbarComponent.vue
```

- **kebab-case**: Clases CSS y rutas
```css
  .product-card { }
  .nav-link { }
```

### Separación de Responsabilidades
- **Componentes**: Lógica de presentación
- **Views**: Composición de componentes
- **Services**: Lógica de negocio y API
- **Router**: Navegación y guards

### Código Limpio
- Comentarios descriptivos
- Indentación consistente (2 espacios)
- Nombres descriptivos de variables
- Funciones pequeñas y específicas

## 🚀 Instalación y Uso
```bash
# Clonar repositorio
git clone [URL_DEL_REPOSITORIO]

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Compilar para producción
npm run build
```

## 👥 Colaboradores
- Keiner Barbosa - 192502
- Laura Garcia - 192501

## 📝 Evidencias de Trabajo Colaborativo
El repositorio incluye evidencias de:
- ✅ Commits descriptivos
- ✅ Uso de ramas (branches)
- ✅ Pull requests
- ✅ Code reviews

## 📚 Tecnologías Utilizadas
- Vue.js 3 (Composition API)
- Vue Router
- Bootstrap 5.3
- Bootstrap Icons
- FakeStore API

## ⚠️ Notas Importantes
Este proyecto fue desarrollado con fines académicos como parte de la actividad de "Construcción de una Aplicación Web Modularizada". No debe utilizarse en ambientes de producción sin implementar las medidas de seguridad adecuadas.