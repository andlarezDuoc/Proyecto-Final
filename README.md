# Black Ink Tattoo - Plataforma de Gestión y Marketplace para Tatuadores

Este repositorio contiene la solución completa de **Black Ink Tattoo**, un sistema web desarrollado para el Proyecto Final que centraliza la búsqueda de artistas, el agendamiento y pago simulado de citas de tatuajes, y el seguimiento de la cicatrización post-sesión.

---

## 1. Estructura del Repositorio

El proyecto está organizado de la siguiente manera:
*   [DOCUMENTACION/](file:///c:/Users/andre/Documents/Black%20Ink%20Tattoo/Proyecto-Final/DOCUMENTACION): Entregables documentales, Carta Gantt, diagramas de UML y el [Plan de Pruebas](file:///c:/Users/andre/Documents/Black%20Ink%20Tattoo/Proyecto-Final/DOCUMENTACION/Plan_de_Pruebas.md).
*   [GESTION/](file:///c:/Users/andre/Documents/Black%20Ink%20Tattoo/Proyecto-Final/GESTION): Gestión administrativa del proyecto, integrantes y el [Registro de Definición del Proyecto](file:///c:/Users/andre/Documents/Black%20Ink%20Tattoo/Proyecto-Final/GESTION/Registro_Definicion_Proyecto.md).
*   [PRODUCTO/](file:///c:/Users/andre/Documents/Black%20Ink%20Tattoo/Proyecto-Final/PRODUCTO): Código fuente de la aplicación.
    *   [frontend/](file:///c:/Users/andre/Documents/Black%20Ink%20Tattoo/Proyecto-Final/PRODUCTO/frontend): Código del cliente web desarrollado en **Next.js (App Router)** y **TypeScript**.
    *   [backend/scriptBD/](file:///c:/Users/andre/Documents/Black%20Ink%20Tattoo/Proyecto-Final/PRODUCTO/backend/scriptBD): Código SQL para el esquema y las políticas RLS de la base de datos Supabase.

---

## 2. Tecnologías Utilizadas

### Frontend:
*   **Next.js 16.2.0 (React 19)** con App Router y Turbopack para compilación rápida.
*   **TypeScript** para tipado estático y robustez del código.
*   **Tailwind CSS** y **Framer Motion** para diseño visual moderno y micro-animaciones premium.
*   **Vitest** como framework de pruebas unitarias automatizadas.

### Backend & Base de Datos:
*   **Supabase (BaaS):** Autenticación de usuarios y almacenamiento de archivos (portafolio de fotos).
*   **PostgreSQL:** Base de datos relacional con políticas de seguridad **Row Level Security (RLS)** para la protección de datos a nivel de fila.

---

## 3. Guía de Instalación y Configuración

Sigue estos pasos para instalar y ejecutar el proyecto en tu máquina local:

### Requisitos Previos:
*   Tener instalado **Node.js** (versión v18 o superior recomendada).

### Paso 1: Clonar e instalar dependencias
1. Abre tu terminal en la carpeta del frontend:
   ```bash
   cd PRODUCTO/frontend
   ```
2. Instala todos los paquetes requeridos por el sistema:
   ```bash
   npm install
   ```

### Paso 2: Configurar las Variables de Entorno (Conexión a Supabase)
Crea un archivo llamado `.env.local` en la carpeta [PRODUCTO/frontend/](file:///c:/Users/andre/Documents/Black%20Ink%20Tattoo/Proyecto-Final/PRODUCTO/frontend) y añade tus credenciales de Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://TU_PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_CLAVE_ANON_DE_SUPABASE
```

### Paso 3: Levantar la Base de Datos (SQL en Supabase)
1. Inicia sesión en tu consola web de **Supabase**.
2. Ve a la sección **SQL Editor** y presiona "New Query".
3. Copia y ejecuta todo el código SQL ubicado en [estructura_completa.sql](file:///c:/Users/andre/Documents/Black%20Ink%20Tattoo/Proyecto-Final/PRODUCTO/backend/scriptBD/estructura_completa.sql).
   *   *Este script creará las tablas `profiles` y `artists`, habilitará RLS, aplicará las políticas de seguridad y creará el bucket de almacenamiento para las fotos.*

### Paso 4: Poblar la Base de Datos con los Artistas de Prueba
Una vez levantado el servidor de desarrollo local, abre tu navegador y visita el endpoint especial de siembra:
`http://localhost:3000/api/seed`
*   *Esto insertará de forma automatizada los artistas iniciales con sus datos y portafolios en tu base de datos Supabase.*

---

## 4. Instrucciones de Ejecución

### Servidor de Desarrollo Local
Para levantar el servidor de desarrollo en tiempo real con recarga rápida de Next.js, ejecuta:
```bash
npm run dev
```
La aplicación estará disponible en: [http://localhost:3000](http://localhost:3000)

### Compilación y Producción
Para validar los tipos de TypeScript y crear una compilación de producción optimizada y empaquetada:
```bash
npm run build
npm run start
```

### Ejecutar Túnel Público Temporal (localtunnel)
Si deseas exponer tu servidor de desarrollo local a internet para que tu profesor u otras personas puedan testearlo sin desplegar, ejecuta el script PowerShell provisto desde la carpeta de tu frontend:
```powershell
./start-tunnel.ps1
```
*El script levantará el servidor Next.js y te entregará una URL pública segura (ej: `https://tattoodemo.loca.lt`).*

---

## 5. Validación y Pruebas

### Pruebas Unitarias Automatizadas
El sistema incluye pruebas automatizadas para funciones utilitarias y los flujos conversacionales de nuestro chatbot interactivo de WhatsApp. Para ejecutarlas:
```bash
npm run test
```

### Validación Manual de Flujos Clave
Encuentra todos los detalles de los casos de prueba manuales ejecutados, datos de entrada, y la matriz de trazabilidad de errores corregidos en el archivo del [Plan de Pruebas de la Aplicación](file:///c:/Users/andre/Documents/Black%20Ink%20Tattoo/Proyecto-Final/DOCUMENTACION/Plan_de_Pruebas.md).