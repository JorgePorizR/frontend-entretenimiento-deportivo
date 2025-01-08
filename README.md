# Aplicación de Entretenimiento Deportivo

## Descripción General

La **Aplicación de Entretenimiento Deportivo** es un sistema completo diseñado para gestionar apuestas deportivas, autenticación de usuarios y recargas de saldo. El proyecto se encuentra dividido en cuatro partes principales, que interactúan entre sí para ofrecer una experiencia integrada y robusta:

- **Frontend**: Desarrollado con `Vite + React.ts + TailwindCSS`.
- **Backend 1 (API de Autenticación)**: Implementado con `Django Rest Framework (DRF)` y autenticación basada en `JWT`.
- **Backend 2 (API de Recarga de Saldos)**: Construido en `ASP.NET C#` utilizando `JWT`.
- **Backend 3 (API de Partidos)**: Desarrollado con `Django Rest Framework (DRF)`.

## Funcionalidades Principales

### Sistema de Autenticación
- Registro y autenticación de usuarios utilizando tokens JWT almacenados en cookies.
- Gestión de roles: cliente, recarga, administrador de partidos, y administrador de usuarios.
- CRUD completo para usuarios:
  - Crear, listar, editar, y eliminar usuarios.
  - Cambiar contraseñas y gestionar roles.
- Seguridad basada en Oauth.

### Sistema de Apuestas
- Acceso limitado a usuarios con rol de cliente.
- Exploración de deportes, ligas y partidos:
  - Listado de deportes con imágenes.
  - Visualización de ligas, partidos actuales y futuros.
  - Detalles de partidos, incluyendo equipos, fecha y hora.
- Gestión de apuestas:
  - Apuestas basadas en resultados (ganador o empate).
  - Actualización en tiempo real de marcadores y eventos utilizando `Socket.IO`.
- Historial de apuestas y movimientos de la billetera.

### Sistema de Recarga de Saldos
- Acceso exclusivo para usuarios con rol de recarga.
- Listado de usuarios y búsqueda por nombre, apellido o correo electrónico.
- Recarga de saldo con comprobantes adjuntos.
- Registro de movimientos en la billetera del usuario.

### Sistema de Administración de Partidos
- Acceso exclusivo para administradores de partidos.
- CRUD completo para deportes, ligas, partidos y eventos.
- Visualización del historial de apuestas por cliente.
- Consulta de ganancias o pérdidas totales por partido o cliente.

## Tecnologías Utilizadas

### Frontend
- **Framework**: React con TypeScript.
- **Estilización**: TailwindCSS.
- **Herramienta de Construcción**: Vite.

### Backend
1. **API de Autenticación**
   - Framework: Django Rest Framework.
   - Autenticación: JWT con Oauth.
2. **API de Recarga de Saldos**
   - Framework: ASP.NET Core.
   - Autenticación: JWT.
3. **API de Partidos**
   - Framework: Django Rest Framework.

### Otras Herramientas
- `Socket.IO` para actualizaciones en tiempo real.

## Estructura del Proyecto en GitHub

El proyecto está organizado en cuatro repositorios separados:
1. **Frontend**: Código fuente del frontend desarrollado con React.
2. **API de Autenticación**: Backend de autenticación desarrollado con Django Rest Framework.
3. **API de Recarga de Saldos**: Backend de recargas desarrollado con ASP.NET Core.
4. **API de Partidos**: Backend de partidos desarrollado con Django Rest Framework.

## Instalación y Uso

1. **Clona los repositorios desde GitHub**:
   ```bash
   git clone <url-frontend>
   git clone <url-api-autenticacion>
   git clone <url-api-recargas>
   git clone <url-api-partidos>

2. **Instalación del Frontend**:
   - Dirígete al directorio del frontend:
     ```bash
     cd frontend
   - Instala las dependencias:
     ```bash
     yarn install
   - Inicia el servidor de desarrollo:
     ```bash
     yarn dev

## Mensaje
Proyecto desarrollado por Jorge como parte de la materia Ingeniería Web III.
