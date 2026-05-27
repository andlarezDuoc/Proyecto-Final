# Diagramas y Especificaciones de Casos de Uso: Black Ink Tattoo

Este documento presenta el **Diagrama de Casos de Uso** general del sistema y detalla las especificaciones formales de los flujos de trabajo clave. Está estructurado bajo los estándares formales de documentación de ingeniería de software.

---

## 1. Diagrama de Casos de Uso General del Sistema

A continuación se presenta el modelo visual desarrollado en **Mermaid** que ilustra las interacciones entre los actores del sistema (Cliente, Tatuador, Supabase y Webpay) y los casos de uso principales:

```mermaid
leftToRightDirection
actor Cliente as "Cliente (Autenticado/Invitado)"
actor Tatuador as "Tatuador (Administrador de Perfil)"
actor Supabase as "Supabase (Auth & DB PostgreSQL)"
actor Webpay as "Webpay Plus (Transbank)"

rectangle "Sistema Black Ink Tattoo" {
    usecase UC1 as "UC-01: Visualizar Catálogo de Artistas"
    usecase UC2 as "UC-02: Interactuar con Chatbot Asistente"
    usecase UC3 as "UC-03: Registrarse / Iniciar Sesión"
    usecase UC4 as "UC-04: Agendar Cita Online"
    usecase UC5 as "UC-05: Procesar Pago de Abono"
    usecase UC6 as "UC-06: Emitir Comprobante de Reserva"
    usecase UC7 as "UC-07: Gestionar Perfil y Portafolio"
    usecase UC8 as "UC-08: Subir Fotos a Storage (Bucket)"
    usecase UC9 as "UC-09: Gestionar Reservas Recibidas"
}

%% Relaciones del Cliente
Cliente --> UC1
Cliente --> UC2
Cliente --> UC3
Cliente --> UC4

%% Relaciones del Tatuador
Tatuador --> UC3
Tatuador --> UC7
Tatuador --> UC8
Tatuador --> UC9

%% Relaciones de Inclusión / Extensión
UC4 .> UC5 : "<< include >>"
UC5 .> UC6 : "<< include >>"

%% Conexiones con Sistemas Externos (Backends/Pasarelas)
UC3 --> Supabase
UC8 --> Supabase
UC5 --> Webpay
UC6 --> Supabase
```

---

## 2. Descripción de Actores del Sistema

| Actor | Tipo | Descripción |
| :--- | :--- | :--- |
| **Cliente** | Humano / Primario | Usuario que navega por la plataforma, consulta con el chatbot, se registra, inicia sesión y agenda citas con sus tatuadores preferidos realizando un abono. |
| **Tatuador** | Humano / Primario | Artista profesional del estudio que administra su perfil público, edita su biografía, sube imágenes de sus trabajos al portafolio y gestiona sus citas agendadas. |
| **Supabase** | Sistema / Secundario | Servicio backend en la nube que gestiona la autenticación de usuarios (`Auth`), almacena perfiles y citas en base de datos PostgreSQL, y aloja imágenes en el bucket de almacenamiento (`Storage`). |
| **Webpay Plus** | Sistema / Secundario | Pasarela externa simulada de pagos (Transbank) encargada de procesar transacciones electrónicas de tarjetas de débito/crédito para el pago de garantías. |

---

## 3. Especificación Formal de Casos de Uso Clave

Para dotar al informe del máximo rigor académico, se detallan las especificaciones completas de los dos casos de uso críticos del sistema.

### Especificación 1: UC-04: Agendar Cita Online (con Pago Seguro)

*   **Descripción:** Permite a un cliente autenticado reservar un bloque horario con un artista específico previo pago de una garantía de abono simulada a través de Webpay Plus.
*   **Actor Primario:** Cliente (Autenticado).
*   **Actores Secundarios:** Webpay Plus (Transbank), Supabase (Base de datos).
*   **Precondiciones:** 
    1.  El cliente debe haber iniciado sesión exitosamente en el sistema.
    2.  El artista elegido debe tener disponibilidad horaria cargada.
*   **Flujo Básico de Eventos:**
    1.  El cliente ingresa al perfil del tatuador y hace clic en **"Reservar"** o **"Agendar Cita"**.
    2.  El cliente selecciona el tamaño del tatuaje (Paso 1). El sistema calcula el valor total y el abono requerido.
    3.  El cliente selecciona el día y hora disponible en el calendario interactivo (Paso 2).
    4.  El sistema muestra el desglose del resumen financiero del servicio (Paso 3).
    5.  El cliente hace clic en **"Pagar abono con Webpay Plus"**.
    6.  El sistema abre el modal del simulador de Webpay Plus en pantalla.
    7.  El cliente ingresa los datos de su tarjeta (Número, CVV, Vencimiento) y hace clic en **"Pagar de forma Segura"**.
    8.  El simulador abre la interfaz bancaria (Redbanc) y el cliente hace clic en **"Autorizar Pago"**.
    9.  El sistema procesa la transacción, confirma la aprobación con Supabase y cierra la pasarela.
    10. El sistema despliega el **Comprobante Oficial de Reserva** con código de autorización Webpay y sello de aprobado (Paso 4).
*   **Flujos Alternos:**
    *   **FA-01: El Cliente no está autenticado:** En el Paso 1, el sistema detecta que no hay sesión activa. Bloquea el botón "Siguiente", muestra un aviso gris superior indicando que debe iniciar sesión y lo redirige a la vista de login.
    *   **FA-02: Transacción Rechazada en Webpay:** En el simulador de banco, el cliente hace clic en "Rechazar Pago". El sistema muestra una alerta roja de "Transacción Rechazada", permitiendo al cliente reintentar el pago o volver a la configuración de la cita.
*   **Postcondiciones:** La cita queda guardada con estado "Pagada" en Supabase y el bloque de calendario se bloquea para impedir duplicaciones.

---

### Especificación 2: UC-08: Subir Fotos a Storage (Bucket)

*   **Descripción:** Permite al tatuador autenticado cargar fotografías en alta resolución de sus trabajos directamente al bucket de almacenamiento público de Supabase para alimentar su portafolio.
*   **Actor Primario:** Tatuador (Autenticado).
*   **Actores Secundarios:** Supabase Storage (Disco duro en la nube).
*   **Precondiciones:**
    1.  El usuario debe estar autenticado con el rol específico de `artist`.
    2.  La imagen debe estar en formatos soportados (PNG, JPG, JPEG) y no exceder los límites de peso establecidos.
*   **Flujo Básico de Eventos:**
    1.  El tatuador inicia sesión y accede a su panel de administración de perfil.
    2.  Hace clic en la sección de "Portafolio" y selecciona **"Subir foto"**.
    3.  El sistema abre el selector de archivos local. El tatuador elige la imagen de su computadora.
    4.  El sistema valida que el formato y peso correspondan.
    5.  El tatuador hace clic en **"Confirmar Subida"**.
    6.  El sistema ejecuta la subida al bucket de Supabase Storage (`portfolio`) comparando la identidad del artista.
    7.  Supabase valida mediante políticas de **Row Level Security (RLS)** que el rol autenticado coincida con los permisos de inserción.
    8.  Supabase almacena el objeto, genera la URL pública de visualización y la indexa en la lista de portafolio del artista.
    9.  El sistema actualiza la galería pública del artista mostrando la nueva foto al instante.
*   **Flujos Alternos:**
    *   **FA-01: Intento de subida no autorizado:** Un usuario con rol `client` o un invitado intenta subir una foto mediante comandos API directos. Supabase intercepta la petición y bloquea la operación retornando un error `403 Forbidden` gracias a las políticas de seguridad RLS del bucket.
    *   **FA-02: Formato de archivo inválido:** El archivo seleccionado no corresponde a imágenes (ej. un PDF). El sistema muestra un mensaje de alerta en pantalla y cancela el flujo de subida.
*   **Postcondiciones:** La imagen queda almacenada en el disco en la nube de Supabase y visible públicamente para todos los usuarios de la web.
