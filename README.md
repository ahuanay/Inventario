# Demo Inventario - Backend (.NET 8 API) + Frontend (Angular 20)

Este proyecto es una aplicación demo de inventariado que consta de un backend desarrollado en **ASP.NET Core Web API (.NET 8)** y un frontend realizado en **Angular 20**.

---

## 📝 Descripción General

El sistema permite gestionar el inventario de productos, almacenes y los movimientos (entradas y salidas) relacionados. Incluye funcionalidades CRUD (Crear, Leer, Actualizar, Eliminar) para cada entidad, además de lógica de control de stock y filtros en consultas.

---

## 🔧 Tecnologías utilizadas

- Backend:
  - ASP.NET Core Web API (.NET 8.0)
  - Entity Framework Core para acceso a datos
  - SQL Server (o base de datos compatible)
- Frontend:
  - Angular 20
- Control de versiones: GitHub ([Backend](https://github.com/ahuanay/Inventario/tree/InventarioApi), [Frontend](https://github.com/ahuanay/Inventario/tree/InventarioWeb))

---

## 🚀 Backend - API REST

Base URL: `/api/v1`

### Entidades principales:

- **Almacenes**
- **Productos**
- **Movimientos**

### Controladores y Endpoints

---

### 📦 Almacenes

`/api/v1/almacenes`

| Método | Ruta                   | Descripción                                           |
|--------|------------------------|-------------------------------------------------------|
| GET    | `/api/v1/almacenes`    | Lista almacenes, con filtros `search` y `es_activo`  |
| GET    | `/api/v1/almacenes/{id}` | Obtiene almacén por ID                                |
| POST   | `/api/v1/almacenes`    | Crea un almacén                                       |
| PUT    | `/api/v1/almacenes/{id}` | Actualiza un almacén                                 |
| DELETE | `/api/v1/almacenes/{id}` | Soft delete (marca eliminado)                        |

**Notas:**

- Filtros disponibles para buscar por código o nombre.
- Soft delete mediante campo `DeletedAt`.
- Validaciones automáticas con ModelState.

---

### 📦 Productos

`/api/v1/productos`

| Método | Ruta                   | Descripción                                              |
|--------|------------------------|----------------------------------------------------------|
| GET    | `/api/v1/productos`    | Lista productos con filtros `search` y `es_activo`       |
| GET    | `/api/v1/productos/{id}` | Obtiene producto por ID                                  |
| POST   | `/api/v1/productos`    | Crea un producto                                         |
| PUT    | `/api/v1/productos/{id}` | Actualiza un producto                                   |
| DELETE | `/api/v1/productos/{id}` | Soft delete (marca eliminado)                           |

**Notas:**

- Soporta búsqueda avanzada por nombre, código o descripción.
- Soft delete con `DeletedAt`.
- La imagen se guarda como Base64 en el campo `ImgBase64`.

---

### 📦 Movimientos

`/api/v1/movimientos`

| Método | Ruta                   | Descripción                                              |
|--------|------------------------|----------------------------------------------------------|
| GET    | `/api/v1/movimientos`  | Lista todos los movimientos                               |
| GET    | `/api/v1/movimientos/{id}` | Obtiene movimiento por ID                              |
| POST   | `/api/v1/movimientos`  | Crea un movimiento (entrada o salida) y actualiza stock  |
| PUT    | `/api/v1/movimientos/{id}` | Actualiza un movimiento                                |
| DELETE | `/api/v1/movimientos/{id}` | Soft delete (marca eliminado)                           |

**Notas:**

- En creación, valida el tipo (`Entrada` o `Salida`) y actualiza la cantidad en el producto.
- Controla que no se pueda sacar más stock del disponible.
- Soft delete con campo `DeletedAt`.
- No actualiza stock al modificar movimientos (mejora posible).

---

## ⚙️ Frontend - Angular 20

- Aplicación Angular que consume la API REST para mostrar y manipular almacenes, productos y movimientos.
- Rutas y componentes para CRUD de cada entidad.
- Filtros de búsqueda, paginación y validación de formularios.

---

## 🛠️ Cómo ejecutar

### Backend (.NET 8 API)

1. Clonar repo backend:  
   ```bash
   git clone https://github.com/ahuanay/Inventario.git -b InventarioApi
   cd Inventario/InventarioApi

2. Configurar cadena de conexión en appsettings.json.
3. Ejecutar migraciones y base de datos (si aplica).
4. Ejecutar la API:
   ```bash
    dotnet run

### Frontend (Angular 20)
1. Clonar repo frontend:
   ```bash
   git clone https://github.com/ahuanay/Inventario.git -b InventarioWeb
   cd Inventario/InventarioWeb
3. Instalar dependencias:
   ```bash
   npm install
5. Ejecutar:
   ```bash
   ng serve

## 🌐 Dónde probar el demo

Puedes probar la aplicación de dos formas:

- **Localmente**, ejecutando backend y frontend siguiendo los pasos anteriores.

- **Online**, visitando el frontend desplegado en:  
  [https://inventarioweb-9ecn.onrender.com/](https://inventarioweb-9ecn.onrender.com/)

> ⚠️ Recuerda que para probar completamente la aplicación local, debes tener la API backend corriendo y configurada correctamente.

📄 Licencia
Este proyecto es solo una demo y puede ser adaptado según necesidades.

🤝 Contacto
Para dudas o sugerencias, puedes contactarme vía GitHub: ahuanay
