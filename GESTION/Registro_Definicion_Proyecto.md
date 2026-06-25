# Registro de Definición e Identificación del Proyecto

Este documento oficial define las bases formales, alcances, objetivos y gobernanza de la plataforma **Black Ink Tattoo** como entregable para el Proyecto Final.

---

## 1. Ficha Técnica del Proyecto

*   **Nombre del Proyecto:** Black Ink Tattoo
*   **Integrantes:**
    1.  Andrea Larez Murguey
    2.  Alejandro Larez Murguey
*   **Docente Evaluador:** Docente de Proyecto Final
*   **Tecnología Base:** Next.js (Frontend), Supabase (Backend/Base de Datos as a Service), PostgreSQL (Base de Datos Relacional).
*   **Área de Negocio:** Industria artística de tatuajes y gestión de citas de servicios.

---

## 2. Identificación del Problema y Oportunidad

### El Problema:
En los estudios de tatuaje independientes o compartidos, la gestión de la agenda y la interacción con los clientes suele ser desordenada. Se depende de chats de redes sociales (Instagram, WhatsApp) donde se pierden citas, no hay un registro consolidado de depósitos o abonos de garantía previos al tatuaje, y no existe un mecanismo automático para dar seguimiento al estado de cicatrización de las piezas, lo cual es vital para el cuidado de la salud del cliente y el control de calidad del tatuador.

### La Oportunidad (La Solución):
**Black Ink Tattoo** es una plataforma centralizada que actúa como:
1.  **Marketplace de Artistas:** Donde los clientes pueden explorar perfiles detallados, estilos específicos y portafolios verificados de diversos tatuadores en tiempo real.
2.  **Sistema de Agendamiento Automatizado:** Integra un flujo interactivo paso a paso para agendar citas directamente en bloques horarios libres, incluyendo una pasarela de pago simulada (Webpay) para abonos de garantía.
3.  **Bandeja de Reportes de Cicatrización:** Un canal privado donde los clientes envían fotos de sus tatuajes ya curados para ser evaluadas por el artista, quien a su vez puede fidelizarlos enviando cupones de descuento automáticos.

---

## 3. Objetivos del Proyecto

### Objetivo General:
Desarrollar una aplicación web interactiva que optimice la visibilidad de los artistas, centralice el agendamiento y pago simulado de reservas, y establezca un canal técnico y seguro para el seguimiento de la cicatrización post-sesión.

### Objetivos Específicos:
*   Diseñar una interfaz web premium con diseño responsivo, responsiva al tema oscuro y orientada a la experiencia de usuario.
*   Implementar un sistema de autenticación diferenciado para Clientes y Tatuadores usando Supabase Auth.
*   Implementar políticas estrictas de seguridad de datos a nivel de fila (Row Level Security - RLS) para proteger la información de los perfiles y portafolios.
*   Habilitar una pasarela interactiva de simulación de pagos con Transbank Webpay Plus para depósitos de garantía.
*   Desarrollar un panel de control privado (Dashboard) para que los artistas editen su portafolio en tiempo real y evalúen el seguimiento de sus clientes.

---

## 4. Alcance del Proyecto

### Dentro del Alcance (In Scope):
*   **Módulo Público:** Landing page, navegación, mapa de ubicación e información de contacto por artista.
*   **Módulo de Registro e Inicio de Sesión:** Autenticación de usuarios clientes y registro/validación de credenciales de tatuadores asignados mediante token de alias.
*   **Módulo de Citas:** Flujo de reservas en 4 pasos (Servicio, Fecha/Hora con calendario interactivo, Pago simulado Webpay, Emisión de Comprobante Oficial en formato de ticket imprimible).
*   **Módulo de Evaluación Post-Tatuaje (Seguimiento):** Formulario para subir fotos de tatuajes cicatrizados desde el perfil del artista y bandeja de entrada en el Dashboard para el tatuador.
*   **Dashboard del Artista:** Gestión del portafolio (subir/eliminar imágenes conectadas a Supabase Storage) y envío de cupones de descuento (10%, 15%, 20%, 25%).

### Fuera del Alcance (Out of Scope):
*   Integración real con Transbank (se mantiene simulada con fines educativos y de reproducibilidad).
*   Pasarela de mensajería SMS masiva para recordatorios (se utiliza un asistente virtual integrado de chat interactivo que emula flujos de preguntas frecuentes y enlaces directos).

---

## 5. Roles y Responsabilidades

*   **Andrea Larez Murguey:** Dirección del proyecto, diseño de Base de Datos y políticas de seguridad (RLS en Supabase), desarrollo de endpoints y lógica de integración del backend.
*   **Alejandro Larez Murguey:** Desarrollo de componentes frontend del Marketplace y el flujo de Agendamiento, diseño visual premium y responsivo de componentes de UI y realización del Plan de Pruebas.

---

## 6. Estrategia de Control de Versiones

El desarrollo del proyecto utiliza **Git** para el control de versiones local y remoto.
*   **Rama Principal (`main`):** Contiene la versión de producción estable y funcional del sistema que se entrega al docente.
*   **Nomenclatura de Commits:** Commits descriptivos que facilitan la trazabilidad técnica de mejoras y cambios aplicados (ej: `fix: corrigiendo dependencias rotas por npm audit`, `feat: agregando bandeja de reportes cicatrizados`).
