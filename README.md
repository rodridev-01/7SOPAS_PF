# 7 Sopas - Sistema Web

Proyecto web académico para un restaurante inspirado en 7 Sopas. Incluye página pública, menú dinámico, carrito de compras, registro de pedidos, reservas y panel administrativo conectado al backend.

## Tecnologías usadas

- HTML5
- CSS3
- JavaScript
- Bootstrap 5
- Node.js
- Express
- JSON como almacenamiento local

## Estructura principal

```txt
7SOPAS_PF/
├── admin/              # Panel administrativo conectado a la API
├── backend/            # Servidor Node.js + Express
│   ├── data/           # Archivos JSON usados como almacenamiento
│   ├── routes/         # Rutas API
│   ├── package.json
│   └── server.js
├── public/             # Páginas públicas, CSS, JS e imágenes
├── index.html          # Página principal
├── package.json        # Script raíz para iniciar backend
└── README.md
```

## Instalación y ejecución

### Opción recomendada

Desde la carpeta raíz del proyecto:

```bash
npm run install:backend
npm start
```

Luego abre en el navegador:

```txt
http://localhost:3000
```

### Opción directa desde backend

```bash
cd backend
npm install
npm start
```

Luego abre:

```txt
http://localhost:3000
```

## Rutas principales del sistema

```txt
http://localhost:3000/              Página principal
http://localhost:3000/menu          Carta de productos
http://localhost:3000/cart          Carrito de compras
http://localhost:3000/reservas      Registro de reservas
http://localhost:3000/sedes         Sedes disponibles
http://localhost:3000/login         Inicio de sesión
http://localhost:3000/register      Registro de usuarios
http://localhost:3000/admin         Login del panel administrador
```

## Funcionalidades implementadas

### Usuario público

- Visualización del menú desde API.
- Agregar productos al carrito.
- Actualizar cantidades en el carrito.
- Eliminar productos del carrito.
- Registrar pedidos.
- Registrar reservas por sede, fecha, hora y cantidad de personas.
- Registro e inicio de sesión de usuarios.
- Sesión básica con `localStorage`.

### Backend

- API de productos.
- API de sedes.
- API de usuarios.
- API de pedidos.
- API de reservas.
- Validación de formularios en backend.
- Registro de pedidos y reservas en archivos JSON.
- Cambio de estado de pedidos y reservas.

### Panel administrador

Disponible en:

```txt
http://localhost:3000/admin
```

Credenciales académicas de administrador:

```txt
Usuario: admin@7sopas.com
Contraseña: admin123
```

El panel valida usuario, contraseña y rol `admin` antes de permitir el ingreso. Si una persona intenta entrar directamente a `/admin/dashboard.html` sin sesión de administrador, será redirigida al login.

Permite visualizar:

- Total de productos.
- Total de sedes.
- Total de pedidos.
- Total de reservas.
- Tabla de pedidos conectada al backend.
- Tabla de reservas conectada al backend.
- Tabla de productos.
- Tabla de sedes.
- Cambio de estado de pedidos y reservas.
- Cierre de sesión de administrador.

## Endpoints principales

### Productos

```txt
GET /api/productos
```

### Sedes

```txt
GET /api/sedes
```

### Usuarios

```txt
GET /api/usuarios                 Requiere sesión admin
POST /api/usuarios/registro
POST /api/usuarios/login
POST /api/usuarios/admin-login
GET /api/usuarios/admin-verificar Requiere sesión admin
```

### Pedidos

```txt
GET /api/pedidos                  Requiere sesión admin
POST /api/pedidos
PATCH /api/pedidos/:id/estado     Requiere sesión admin
DELETE /api/pedidos/:id           Requiere sesión admin
```

### Reservas

```txt
GET /api/reservas                 Requiere sesión admin
POST /api/reservas
PATCH /api/reservas/:id/estado    Requiere sesión admin
DELETE /api/reservas/:id          Requiere sesión admin
```

## Datos de prueba

Usuario compatible:

```txt
Correo: rodrigo@gmail.com
Contraseña: 123
```

## Reinstalar dependencias Node.js

Ejecutar:

```bash
npm run install:backend     // Carpeta principal
npm start                   
```

## Integrantes del Grupo

- Leonardo Josue Chavez Rojas
- Samantha Luciana Jimenez Montes
- Josue Moises Ordoñez Benites
- Britanny Karolin Parra Huatuco
- Rodrigo Alexander Peña Hernandez