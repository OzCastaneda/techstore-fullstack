# 🛍️ TechStore Online

Una plataforma de e-commerce full stack moderna para productos de tecnología, desarrollada con Node.js, React y MongoDB.

## 📋 Descripción del Proyecto

TechStore Online es una tienda virtual completa que permite a los usuarios navegar por productos de tecnología, gestionar un carrito de compras y realizar pedidos. Incluye un panel de administración para la gestión de productos e inventario.

## ✨ Características Principales

### 🔐 Autenticación y Autorización

- Registro e inicio de sesión de usuarios
- Autenticación JWT con tokens seguros
- Roles de usuario (Cliente/Administrador)
- Protección de rutas según permisos

### 🛒 Funcionalidades de E-commerce

- Catálogo de productos con categorías
- Sistema de carrito de compras
- Proceso de checkout completo
- Gestión de pedidos y estados
- Control automático de inventario

### 👨‍💼 Panel de Administración

- CRUD completo de productos
- Gestión de inventario y stock
- Administración de pedidos
- Control de estados de envío

### 🎨 Interfaz de Usuario

- Diseño responsive con Tailwind CSS
- Navegación intuitiva con React Router
- Componentes reutilizables
- Experiencia de usuario moderna

## 🛠️ Tecnologías Utilizadas


### Backend

- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación con tokens
- **bcryptjs** - Encriptación de contraseñas

### Frontend

- **React** - Biblioteca de interfaz de usuario
- **Vite** - Herramienta de desarrollo rápida
- **React Router** - Navegación entre páginas
- **Axios** - Cliente HTTP para APIs
- **Tailwind CSS** - Framework de estilos
- **Lucide React** - Iconos modernos

### Base de Datos

- **MongoDB Atlas** - Base de datos en la nube
- **Mongoose** - Modelado de datos

## 📁 Estructura del Proyecto

techstore-fullstack/
├── backend/                 # Servidor Node.js
│   ├── src/
│   │   ├── controllers/     # Lógica de negocio
│   │   ├── models/         # Modelos de datos
│   │   ├── routes/         # Rutas de la API
│   │   ├── middlewares/    # Middlewares personalizados
│   │   ├── config/         # Configuraciones
│   │   └── index.js        # Punto de entrada
│   ├── package.json
│   └── .env                # Variables de entorno
├── frontend/               # Aplicación React
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/          # Páginas de la aplicación
│   │   ├── context/        # Context API para estado global
│   │   ├── api/            # Funciones para conectar con backend
│   │   └── assets/         # Recursos estáticos
│   ├── package.json
│   └── vite.config.js
└── README.md

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (v16 o superior)
- npm o yarn
- Cuenta en MongoDB Atlas

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/techstore-fullstack.git
cd techstore-fullstack

## 2. Configurar el Backend
cd backend
npm install

## 🔗 API Endpoints

### Autenticación

- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión


### Usuarios

- `GET /api/users/profile` - Obtener perfil (protegido)
- `GET /api/users/all` - Obtener todos los usuarios (admin)


### Productos

- `GET /api/products` - Obtener productos (público)
- `GET /api/products/:id` - Obtener producto por ID (público)
- `POST /api/products` - Crear producto (admin)
- `PUT /api/products/:id` - Actualizar producto (admin)
- `DELETE /api/products/:id` - Eliminar producto (admin)


### Carrito

- `GET /api/cart` - Obtener carrito (protegido)
- `POST /api/cart` - Agregar al carrito (protegido)
- `PUT /api/cart` - Actualizar carrito (protegido)
- `DELETE /api/cart/:productId` - Remover del carrito (protegido)


### Pedidos

- `POST /api/orders` - Crear pedido (protegido)
- `GET /api/orders/my-orders` - Obtener pedidos del usuario (protegido)
- `GET /api/orders` - Obtener todos los pedidos (admin)
- `PUT /api/orders/:id/status` - Actualizar estado del pedido (admin)


## 🧪 Funcionalidades Probadas

- ✅ Registro e inicio de sesión de usuarios
- ✅ Autenticación con JWT
- ✅ Protección de rutas
- ✅ CRUD de productos
- ✅ Sistema de carrito de compras
- ✅ Proceso de checkout
- ✅ Gestión de pedidos
- ✅ Control de inventario
- ✅ Roles de usuario


## 🚧 Próximas Características

- Página de productos con filtros
- Carrito de compras interactivo
- Panel de administración completo
- Sistema de pagos
- Notificaciones por email
- Búsqueda avanzada
- Reseñas de productos
- Dockerización
- Despliegue en producción


## 👨‍💻 Desarrollo

Este proyecto fue desarrollado como parte del aprendizaje de desarrollo full stack, implementando las mejores prácticas de:

- Arquitectura MVC en el backend
- Componentes reutilizables en React
- Gestión de estado con Context API
- Autenticación segura con JWT
- Validación de datos
- Manejo de errores
- Diseño responsive


## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la [Licencia MIT](LICENSE).

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request


---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!

`

```
