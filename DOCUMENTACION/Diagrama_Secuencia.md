# Diagrama de Secuencia: Proceso de Agendamiento de Cita

Este documento contiene el **Diagrama de Secuencia** detallado para el flujo de trabajo de agendamiento de citas con pago de garantía (Webpay Plus) en la plataforma **Black Ink Tattoo**. Ilustra el intercambio de mensajes cronológico entre los actores y componentes del sistema.

---

## 1. Diagrama de Secuencia en Código Mermaid

A continuación, se detalla el diagrama de secuencia interactivo desarrollado en **Mermaid** que modela la interacción temporal del sistema:

```mermaid
sequenceDiagram
    autonumber
    actor Cliente as Cliente (Autenticado)
    participant Frontend as Frontend (Next.js / React)
    participant Supabase as Backend (Supabase / Auth / DB)
    participant Webpay as Pasarela (Webpay Plus / Transbank)

    Note over Cliente, Frontend: 1. Inicio de Sesión Obligatorio
    Cliente->>Frontend: Ingresar credenciales (email, password)
    Frontend->>Supabase: Iniciar sesión (auth.signInWithPassword)
    Supabase-->>Frontend: Retorna sesión activa y datos de rol
    Frontend-->>Cliente: Habilita botones de reserva

    Note over Cliente, Frontend: 2. Selección de Servicio, Fecha y Hora
    Cliente->>Frontend: Selecciona tamaño de tatuaje (Paso 1)
    Frontend->>Frontend: Calcula valor total y abono requerido
    Cliente->>Frontend: Selecciona día y hora en calendario (Paso 2)
    Frontend-->>Cliente: Muestra resumen financiero detallado (Paso 3)

    Note over Cliente, Webpay: 3. Proceso Transaccional con Webpay Plus
    Cliente->>Frontend: Clic en "Pagar abono con Webpay Plus"
    Frontend->>Frontend: Despliega modal interactivo WebpaySimulator
    Cliente->>Frontend: Ingresa datos de tarjeta y hace clic en Pagar
    Frontend->>Webpay: Solicita procesamiento de abono (Monto)
    Webpay-->>Frontend: Muestra ventana bancaria (Redbanc)
    Cliente->>Frontend: Clic en "Autorizar Pago Simulado"
    Frontend->>Webpay: Envía autorización
    Webpay-->>Frontend: Retorna confirmación de pago (AuthCode, TransId)

    Note over Frontend, Supabase: 4. Registro de Reserva en Base de Datos
    Frontend->>Supabase: Inserta registro de cita (artista, fecha, hora, abono, transId, estado: 'Pagada')
    Supabase-->>Frontend: Confirma almacenamiento exitoso (201 Created)
    
    Note over Cliente, Frontend: 5. Emisión de Comprobante
    Frontend-->>Cliente: Renderiza Comprobante de Reserva con ticket imprimible (Paso 4)
```

---

## 2. Descripción de Flujo Cronológico

1.  **Autenticación:** El Cliente inicia sesión. El Frontend solicita la validación a Supabase Auth, el cual retorna los metadatos de sesión válidos.
2.  **Configuración de Cita:** El Cliente escoge su servicio (Tatuaje Pequeño, Mediano, Grande, Cover Up) y el sistema calcula el abono. Luego, escoge una fecha y hora disponible.
3.  **Procesamiento de Pago (Webpay):** El Cliente inicia el pago de garantía. Se abre el simulador de Webpay, se ingresan los datos de tarjeta, se solicita autorización a Transbank y se simula la autenticación bancaria en Redbanc. Transbank retorna el código de autorización y el ID de transacción.
4.  **Confirmación y Persistencia:** Con el pago aprobado, el Frontend realiza una inserción segura en Supabase para registrar la reserva y bloquear el bloque de horario en el calendario.
5.  **Entregable:** Se emite el ticket oficial en PDF/Pantalla con sello de "Pago Aprobado" para el cliente.
