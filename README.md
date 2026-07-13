# 📚 Mundo Entre Libros

**Mundo Entre Libros** es una aplicación full stack de e-commerce literario desarrollada como proyecto integrador.  
La plataforma permite explorar un catálogo de libros y sagas, crear una cuenta de usuario, iniciar sesión, administrar un perfil lector, guardar favoritos, agregar productos al carrito, generar pedidos simulados y participar en foros por género literario.

Este proyecto fue construido con enfoque de aprendizaje profesional, integrando frontend, backend, base de datos, autenticación, consumo de API REST y despliegue en producción.

---

## 🚀 Demo en producción

- **Frontend:** [https://mundo-entre-libros-personal.vercel.app/](https://mundo-entre-libros-personal.vercel.app/)
- **Backend API:** [https://ecommerce-libreria.onrender.com/api/health](https://ecommerce-libreria.onrender.com/api/health)

> Nota: el backend está desplegado en Render. En planes gratuitos, el primer acceso puede tardar algunos segundos porque el servicio puede entrar en reposo.

---

## 🧠 Objetivo del proyecto

El objetivo principal fue transformar una tienda literaria en una aplicación full stack funcional, conectando una interfaz moderna con una API propia y persistencia en base de datos.

El proyecto permitió practicar e integrar:

- Desarrollo frontend con Next.js y TypeScript.
- Construcción de API REST con Java y Spring Boot.
- Autenticación con JWT.
- Persistencia de datos con JPA/Hibernate.
- Integración frontend-backend mediante fetch.
- Manejo de estado global con Context API.
- Configuración de variables de entorno.
- Configuración de CORS para producción.
- Despliegue de frontend y backend en plataformas cloud.
- Adaptación de base de datos de MySQL local a PostgreSQL en producción.

---

## 🛠️ Tecnologías utilizadas

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- CSS Modules
- Context API
- Lucide React
- SweetAlert2
- Vercel

### Backend

- Java 21
- Spring Boot
- Spring Web
- Spring Security
- Spring Data JPA
- Hibernate
- JWT
- Maven
- Docker
- Render

### Base de datos

- MySQL para entorno local
- PostgreSQL para producción en Render

### Herramientas de desarrollo

- Git
- GitHub
- VS Code
- Postman
- Docker Desktop
- Render
- Vercel

---

## ✨ Funcionalidades principales

### Catálogo literario

- Consulta de libros por categoría.
- Consulta de sagas literarias.
- Visualización de portada, autor, precio, editorial, edición, ISBN y sinopsis.
- Carga inicial del catálogo desde archivo JSON mediante un seeder en backend.
- Navegación por secciones principales: inicio, catálogo, foros, nosotros y contacto.

### Autenticación

- Registro de usuarios.
- Inicio de sesión.
- Generación y validación de JWT.
- Protección de rutas privadas mediante token.
- Persistencia de sesión en navegador.

### Perfil lector

- Consulta de datos del usuario autenticado.
- Edición de nombre visible.
- Registro de lectura actual.
- Selección de estado lector.
- Selección de género favorito.
- Biografía del usuario.
- Dirección de envío.

### Favoritos

- Agregar libros a favoritos.
- Agregar sagas a favoritos.
- Consultar lista de favoritos.
- Eliminar elementos de favoritos.
- Persistencia de favoritos por usuario autenticado.

### Carrito de compras

- Agregar libros al carrito.
- Agregar sagas al carrito.
- Modificar cantidades.
- Eliminar productos.
- Vaciar carrito.
- Cálculo de subtotal, total de productos y total general.

### Pedidos

- Checkout simulado.
- Generación automática de número de pedido.
- Guardado histórico de pedidos por usuario.
- Consulta de pedidos desde la cuenta del usuario.
- Conservación de datos de envío al momento de generar el pedido.

### Foros literarios

- Foros por género o temática literaria.
- Suscripción a foros.
- Creación de publicaciones.
- Creación de respuestas.
- Sistema de puntos por participación.
- Eliminación lógica de publicaciones y respuestas propias.

---

## 🧩 Arquitectura general

El proyecto está dividido en dos partes principales:

```txt
mundo-entre-libros
├── backend
│   └── API REST con Spring Boot
│
├── src
│   └── Frontend con Next.js
│
├── public
│   └── Imágenes, portadas, logos y assets
│
├── docker-compose.prod.yml
│   └── Configuración Docker para backend y MySQL
│
└── README.md
```

---

## 📁 Estructura del frontend

```txt
src
├── app
│   ├── carrito
│   ├── catalogo
│   ├── contacto
│   ├── cuenta
│   │   └── pedidos
│   ├── foros
│   ├── nosotros
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components
│   ├── about
│   ├── account
│   ├── cart
│   ├── catalog
│   ├── contact
│   ├── forums
│   ├── home
│   ├── layout
│   ├── providers
│   └── ui
│
├── context
│   ├── AccountContext.tsx
│   ├── CartContext.tsx
│   ├── OrderContext.tsx
│   └── WishlistContext.tsx
│
├── lib
│   ├── api.ts
│   ├── api-types.ts
│   ├── auth-api.ts
│   ├── auth-storage.ts
│   ├── cart-api.ts
│   ├── catalog-api.ts
│   ├── forum-api.ts
│   ├── order-api.ts
│   ├── profile-api.ts
│   └── wishlist-api.ts
│
└── types
    ├── account.ts
    ├── book.ts
    ├── cart.ts
    ├── forum.ts
    ├── order.ts
    ├── user.ts
    └── wishlist.ts
```

---

## 📁 Estructura del backend

```txt
backend
└── src/main/java/com/mundoentrelibros/api
    ├── address
    ├── auth
    ├── cart
    ├── catalog
    ├── common
    ├── config
    ├── forum
    ├── order
    ├── profile
    ├── user
    └── wishlist
```

El backend está organizado por dominios funcionales para separar responsabilidades:

| Módulo | Responsabilidad |
|---|---|
| `auth` | Registro, login, generación de JWT y usuario autenticado |
| `catalog` | Libros, categorías, sagas y carga inicial de catálogo |
| `profile` | Perfil lector del usuario |
| `address` | Dirección asociada al usuario |
| `wishlist` | Favoritos |
| `cart` | Carrito de compras |
| `order` | Pedidos y checkout simulado |
| `forum` | Foros, publicaciones, respuestas, membresías y puntos |
| `config` | Seguridad, CORS y filtro JWT |
| `common` | Health check y manejo global de errores |

---

## 🔐 Autenticación y seguridad

La autenticación funciona con JWT.

Flujo general:

1. El usuario se registra o inicia sesión.
2. El backend valida la información.
3. El backend genera un token JWT.
4. El frontend guarda el token en `localStorage`.
5. Las rutas protegidas envían el token en el header:

```txt
Authorization: Bearer <token>
```

El backend valida el token antes de permitir acceso a recursos privados como perfil, favoritos, carrito, pedidos y foros.

---

## 🌐 Endpoints principales

### Health check

```txt
GET /api/health
```

### Auth

```txt
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Catálogo

```txt
GET /api/catalog
GET /api/categories
GET /api/books
GET /api/books/{id}
GET /api/sagas
GET /api/sagas/{slug}
```

### Perfil

```txt
GET /api/profile
PUT /api/profile
PUT /api/profile/address
```

### Favoritos

```txt
GET    /api/wishlist
POST   /api/wishlist/books/{bookId}
POST   /api/wishlist/sagas/{sagaSlug}
DELETE /api/wishlist/items/{itemId}
```

### Carrito

```txt
GET    /api/cart
POST   /api/cart/books/{bookId}
POST   /api/cart/sagas/{sagaSlug}
PATCH  /api/cart/items/{itemId}
DELETE /api/cart/items/{itemId}
DELETE /api/cart
```

### Pedidos

```txt
POST /api/orders
GET  /api/orders
GET  /api/orders/{orderId}
```

### Foros

```txt
GET    /api/forums
GET    /api/forums/{forumSlug}
POST   /api/forums/{forumSlug}/subscribe
DELETE /api/forums/{forumSlug}/subscribe
GET    /api/forums/{forumSlug}/posts
POST   /api/forums/{forumSlug}/posts
GET    /api/forums/posts/{postId}
POST   /api/forums/posts/{postId}/replies
DELETE /api/forums/posts/{postId}
DELETE /api/forums/replies/{replyId}
```

---

## ⚙️ Variables de entorno

### Frontend

Crear un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

En producción, en Vercel:

```env
NEXT_PUBLIC_API_URL=https://ecommerce-libreria.onrender.com
```

---

### Backend local con MySQL

El backend puede ejecutarse localmente con MySQL usando variables como estas:

```env
SPRING_APPLICATION_NAME=mundo-entre-libros-api
PORT=8080

SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/mundo_entre_libros_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
SPRING_DATASOURCE_USERNAME=mel_user
SPRING_DATASOURCE_PASSWORD=TU_PASSWORD

SPRING_DATASOURCE_DRIVER_CLASS_NAME=com.mysql.cj.jdbc.Driver
SPRING_JPA_DATABASE_PLATFORM=org.hibernate.dialect.MySQLDialect

SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=false
SPRING_JPA_FORMAT_SQL=false

JWT_SECRET=CAMBIA_ESTE_SECRET_POR_UNO_MUY_LARGO_Y_SEGURO
JWT_EXPIRATION_MS=86400000

APP_CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

---

### Backend en producción con PostgreSQL

Variables usadas en Render:

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://HOST:5432/DATABASE
SPRING_DATASOURCE_USERNAME=USUARIO_DE_RENDER
SPRING_DATASOURCE_PASSWORD=PASSWORD_DE_RENDER
SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.postgresql.Driver

SPRING_JPA_DATABASE_PLATFORM=org.hibernate.dialect.PostgreSQLDialect
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=false
SPRING_JPA_FORMAT_SQL=false

JWT_SECRET=SECRET_LARGO_Y_SEGURO
JWT_EXPIRATION_MS=86400000

APP_CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,https://mundo-entre-libros-personal.vercel.app/
```

> Importante: las variables con contraseñas o secretos no deben subirse al repositorio.

---

## ▶️ Cómo ejecutar el proyecto localmente

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU-USUARIO/TU-REPO.git
cd TU-REPO
```

---

### 2. Instalar dependencias del frontend

```bash
npm install
```

---

### 3. Levantar el frontend

```bash
npm run dev
```

El frontend queda disponible en:

```txt
http://localhost:3000
```

---

### 4. Levantar el backend

En otra terminal:

```bash
cd backend
./mvnw spring-boot:run
```

En Windows PowerShell:

```bash
cd backend
.\mvnw spring-boot:run
```

El backend queda disponible en:

```txt
http://localhost:8080
```

Puedes probarlo con:

```txt
http://localhost:8080/api/health
```

---

## 🐳 Ejecución con Docker

El proyecto incluye configuración para levantar backend y MySQL con Docker Compose.

Archivo principal:

```txt
docker-compose.prod.yml
```

Comando:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production up --build
```

Esto levanta:

```txt
mel-mysql
mel-api
```

---

## 🚀 Despliegue

### Frontend

El frontend fue desplegado en Vercel.

Configuración principal:

```env
NEXT_PUBLIC_API_URL=(https://ecommerce-libreria.onrender.com)
```

### Backend

El backend fue desplegado en Render usando Docker.

Configuración principal del servicio:

```txt
Root Directory: backend
Environment: Docker
```

### Base de datos

La base de datos de producción se configuró con PostgreSQL en Render.

Durante el despliegue se adaptó la configuración del backend para permitir:

- MySQL en entorno local.
- PostgreSQL en producción.
- Variables de entorno para driver y dialecto de base de datos.
- CORS para permitir comunicación entre Vercel y Render.
- Uso de HTTPS para evitar problemas de mixed content entre frontend y backend.

---

## 🧪 Pruebas funcionales realizadas

Se validaron los siguientes flujos en producción:

- Registro de usuario.
- Inicio de sesión.
- Carga del catálogo.
- Consulta de perfil.
- Edición de perfil lector.
- Agregar libros y sagas a favoritos.
- Agregar productos al carrito.
- Modificar cantidades del carrito.
- Eliminar productos del carrito.
- Generar pedido simulado.
- Consultar historial de pedidos.
- Entrar a foros.
- Suscribirse a foros.
- Crear publicaciones.
- Responder publicaciones.
- Cerrar sesión y volver a iniciar sesión.

---

## 🧱 Retos técnicos resueltos

Durante el desarrollo y despliegue se resolvieron problemas reales de integración, entre ellos:

- Conexión del frontend Next.js con backend Spring Boot.
- Manejo de JWT en frontend y backend.
- Protección de rutas privadas.
- Configuración de CORS en producción.
- Despliegue inicial en AWS EC2 con Docker.
- Pruebas con MySQL en contenedor.
- Migración de despliegue a Render para usar HTTPS.
- Cambio de MySQL local a PostgreSQL en producción.
- Corrección de tipos incompatibles entre MySQL y PostgreSQL, como `LONGTEXT` a `TEXT`.
- Uso correcto de variables de entorno para evitar hardcodear credenciales.
- Manejo de errores de autenticación y persistencia.
- Validación de comunicación entre Vercel, Render y la base de datos.

---

## 📌 Estado del proyecto

Proyecto terminado y desplegado como aplicación full stack para portafolio.

Funcionalidades implementadas:

- Frontend responsive.
- API REST propia.
- Base de datos persistente.
- Autenticación con JWT.
- Perfil de usuario.
- Catálogo dinámico.
- Favoritos.
- Carrito.
- Pedidos.
- Foros.
- Despliegue en producción.

---

## 🔮 Mejoras futuras

Algunas mejoras que podrían implementarse después:

- Panel de administración para gestionar libros, sagas y usuarios.
- Pasarela de pago real.
- Subida de avatar a almacenamiento externo.
- Recuperación de contraseña.
- Confirmación de correo electrónico.
- Roles administrativos con permisos diferenciados.
- Buscador avanzado por título, autor o categoría.
- Paginación del catálogo.
- Optimización del cold start del backend.
- Tests unitarios e integración más completos.
- Documentación Swagger/OpenAPI para la API.
- Sistema de reseñas y calificaciones de libros.

---

## 👩‍💻 Equipo de desarrollo

### María Fernanda Rodríguez Trinidad

**Rol:** Desarrolladora Java Full Stack Jr.  

Participación principal:

- Diseño visual.
- Desarrollo frontend.
- Integración con backend.
- Construcción de flujos de usuario.
- Consumo de API REST.
- Configuración de despliegue.
- Resolución de errores de producción.
- Integración final frontend-backend.

LinkedIn: [María Fernanda Rodríguez Trinidad](https://www.linkedin.com/in/mariafernanda-rodriguez-trinidad/)

---

### Ilse Adriana Careo Galicia

**Rol:** Desarrolladora.  

Participación principal:

- Colaboración en el desarrollo del proyecto.
- Apoyo en estructura visual y funcionalidades de la aplicación.
- Participación en la construcción de la experiencia de usuario.
- Trabajo colaborativo en componentes y secciones del sitio.

GitHub: [iladricg14-lab](https://github.com/iladricg14-lab)

---

## 📄 Licencia

Este proyecto fue desarrollado con fines educativos y de portafolio profesional.
