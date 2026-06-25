# Plan y Reporte de Pruebas del Sistema

Este documento contiene el plan formal de pruebas aplicadas al sistema **Black Ink Tattoo**, los resultados obtenidos y la matriz de trazabilidad de cambios y mejoras aplicadas.

---

## 1. Diseño del Plan de Pruebas

Para validar el correcto funcionamiento de los componentes críticos de la plataforma, se diseñaron y ejecutaron los siguientes casos de prueba:

### Resumen de Casos de Prueba (CP):
*   **CP-01:** Registro de Cuenta diferenciado (Cliente vs Tatuador).
*   **CP-02:** Inicio de Sesión y Persistencia de Sesión con Supabase Auth.
*   **CP-03:** Exploración del Marketplace de Artistas y filtrado por ubicación/estilo.
*   **CP-04:** Reserva paso a paso de Citas con pago simulado de garantía Transbank Webpay Plus.
*   **CP-05:** Carga y envío de foto de seguimiento del tatuaje cicatrizado por parte del Cliente.
*   **CP-06:** Visualización de reportes recibidos y envío de cupones de descuento desde el Dashboard del Tatuador.
*   **CP-07:** Operación CRUD en Portafolio: Subir y eliminar imágenes reales conectadas a Supabase Storage.
*   **CP-08:** Seguridad: Bloqueo de acceso a rutas protegidas (`/dashboard`) para no autenticados.
*   **CP-09:** Seguridad: Validación de políticas de Row Level Security (RLS) en la base de datos PostgreSQL.
*   **CP-10:** Pruebas unitarias automatizadas con Vitest.

---

## 2. Detalle y Resultados de Ejecución de Pruebas

| ID Caso | Descripción | Pasos de Ejecución | Datos Utilizados | Resultado Esperado | Resultado Obtenido | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **CP-01** | Registro de cuenta. | 1. Ir a `/register`. <br>2. Seleccionar Rol.<br>3. Rellenar campos.<br>4. Presionar Registrarse. | **Cliente:** cliente-prueba@correo.com / clave123<br>**Tatuador:** marcos-silva (Token de validación) | Creación exitosa del perfil en Supabase Auth y en las tablas públicas `profiles` y `artists`. | Registro exitoso. Se crearon las filas correspondientes en las tablas de PostgreSQL. | **PASADO** |
| **CP-02** | Inicio de sesión. | 1. Ir a `/login` o `/login-client`.<br>2. Ingresar credenciales.<br>3. Enviar. | cliente-prueba@correo.com / clave123 | Redirección al Home (clientes) o al Dashboard (tatuadores) con sesión JWT activa. | Inicio de sesión correcto. Redirección automática según el rol del usuario. | **PASADO** |
| **CP-03** | Marketplace y Filtros. | 1. Ir a la sección "Artistas".<br>2. Seleccionar filtros de estilo o ubicación.<br>3. Escribir en buscador. | Filtro: "Providencia" (ubicación) y "Blackwork" (estilo). | La lista de artistas se actualiza mostrando solo las coincidencias en tiempo real. | Búsqueda y filtrado funcional. Los artistas se listan según los criterios. | **PASADO** |
| **CP-04** | Flujo de Reserva y Pago. | 1. Ir a perfil de artista.<br>2. Presionar "Reservar".<br>3. Completar pasos 1, 2 y 3.<br>4. Pagar en simulador Webpay.<br>5. Ver ticket. | Tarjeta Débito: 55554444 / Expiración: 12/28 / CVV: 123. Abono: $20.000 | Aprobación del pago simulado de garantía y visualización del ticket con código de autorización. | Pago aprobado. Se genera el comprobante oficial en formato ticket imprimible. | **PASADO** |
| **CP-05** | Envío de reporte de cicatrización. | 1. Iniciar sesión como cliente.<br>2. Ir a perfil de tu tatuador.<br>3. Presionar botón flotante "Seguimiento".<br>4. Subir foto y enviar. | Foto: `tatuaje_curado.jpg` / Comentario: "Curó perfecto." | Envío exitoso de la foto al servidor para evaluación del tatuador. | Notificación de envío exitoso y actualización de la base de datos simulada. | **PASADO** |
| **CP-06** | Bandeja de Reportes y Cupón. | 1. Iniciar sesión como tatuador.<br>2. Ir a `/dashboard/reports`.<br>3. Ver reporte.<br>4. Presionar "Enviar Bono Mágico". | Descuento: 15% / Mensaje: "¡Excelente cuidado!" | Envío del cupón de descuento y cambio de estado del reporte a "Leído". | Cupón generado. El reporte cambia de estado y se bloquea el reenvío. | **PASADO** |
| **CP-07** | CRUD del Portafolio. | 1. Loguearse como tatuador.<br>2. Ir a `/dashboard`.<br>3. Cargar archivo de imagen.<br>4. Eliminar una existente. | Imagen: `nuevo_diseño.png` | Subida real a Supabase Storage (bucket `portfolio`) y actualización inmediata en el portafolio público. | Imagen subida al storage y renderizada en tiempo real. Eliminación física completada. | **PASADO** |
| **CP-08** | Seguridad de Rutas. | 1. Abrir navegador incógnito.<br>2. Ingresar a `/dashboard`. | Ninguno | Redirección automática inmediata al login (`/login`) impidiendo ver el panel. | Acceso denegado y redirección forzosa implementada de manera exitosa. | **PASADO** |
| **CP-09** | Seguridad RLS (Base de Datos). | 1. Intentar modificar artista ajeno por API REST.<br>2. Intentar subir imagen sin token JWT. | Solicitud HTTP POST directa sin cabeceras de autorización. | Retorno de error `401 Unauthorized` o `403 Forbidden` por parte de Supabase. | La API de Supabase bloqueó la inyección directa, confirmando la seguridad de RLS. | **PASADO** |
| **CP-10** | Pruebas Automatizadas. | 1. Ejecutar comando de pruebas unitarias. | Ejecución de `npm run test` (Vitest) | 100% de las pruebas unitarias de utilidades y flujos de chat pasadas con éxito. | 10 de 10 pruebas unitarias pasadas exitosamente en 1.69 segundos. | **PASADO** |

---

## 3. Matriz de Trazabilidad de Errores, Cambios y Mejoras

Durante el desarrollo y pruebas del sistema, se registraron problemas técnicos que fueron corregidos y documentados para asegurar la reproducibilidad y estabilidad del sistema:

| ID Incidencia | Descripción del Error Detectado | Origen / Componente | Acción Correctiva / Cambio Aplicado | Resultado de la Mejora |
| :--- | :--- | :--- | :--- | :--- |
| **INC-01** | Conflicto destructivo de dependencias al intentar actualizar dependencias de desarrollo (`ERESOLVE unable to resolve dependency tree`). | `package.json` del Frontend | Restauración de `package.json` a versión estable mediante Git (`git checkout`) y reinstalación limpia de librerías en Next.js 16.2.0. | El proyecto vuelve a compilar de manera óptima y exitosa en producción (`npm run build`). |
| **INC-02** | Vulnerabilidad potencial de inyección directa de datos en perfiles de artistas desde clientes HTTP externos. | Base de datos (Tablas públicas de Supabase) | Activación de **Row Level Security (RLS)** y creación de políticas `WITH CHECK (auth.uid() = id)` para validar la identidad del solicitante. | Los atacantes no pueden modificar datos ajenos, protegiendo la integridad del sistema. |
| **INC-03** | Errores de hidratación de React en cliente (`hydration mismatch`) debido a la generación aleatoria de puntajes, likes y distancias. | Componentes `gallery-section.tsx` y `artist-card.tsx` | Reemplazo de funciones `Math.random()` por algoritmos deterministas basados en las propiedades del artista (`artist.id` y longitud del nombre). | Coherencia perfecta entre el HTML renderizado por el servidor y el cliente. Cero advertencias en consola. |
| **INC-04** | Ubicación incorrecta del script de túnel público, causando fallos al ejecutar comandos relativos. | Estructura de carpetas | Traslado del script [start-tunnel.ps1](file:///c:/Users/andre/Documents/Black%20Ink%20Tattoo/Proyecto-Final/PRODUCTO/frontend/start-tunnel.ps1) al frontend y actualización de rutas en su documentación interna. | El script es reproducible y ejecutable directamente desde el subdirectorio de la aplicación. |
