export const TERMS_TEXT = `TÉRMINOS Y CONDICIONES DE USO Y CONTRATACIÓN DE LA PLATAFORMA RESPI

Última actualización: Junio de 2026

1. OBJETO Y ÁMBITO DE APLICACIÓN
Las presentes Condiciones de Uso y Contratación (en adelante, "Términos") regulan de forma vinculante el acceso, la navegación y la utilización de la aplicación móvil y la plataforma backend "RESPI" (en adelante, la "Aplicación" o el "Sistema"). RESPI es una plataforma tecnológica dedicada a la intermediación, reserva automatizada, cobro y gestión integral de pistas e instalaciones deportivas. 

Al descargar, instalar, registrarse o utilizar cualquier servicio de la Aplicación, el usuario adquiere la condición de "Usuario" (ya sea en calidad de Cliente o Administrador) y acepta de manera expresa, voluntaria y sin reservas la totalidad de las cláusulas aquí dispuestas. Si no está de acuerdo con estos Términos, deberá abstenerse de utilizar la plataforma y proceder a su desinstalación.

2. CONDICIONES DE ACCESO, REGISTRO Y SEGURIDAD DE LA CUENTA
Para acceder a la operativa del sistema (incluyendo la visualización de la disponibilidad de pistas en tiempo real, creación de reservas y emisión de valoraciones), el Usuario debe completar obligatoriamente el proceso de registro creando una cuenta única e intransferible. El Usuario se compromete a:
• Aportar información verídica, exacta y actualizada (nombre, apellidos y correo electrónico).
• Custodiar sus credenciales de acceso (contraseña) de forma confidencial. El uso de la cuenta se presume realizado siempre por el titular de la misma.
• Notificar de manera inmediata al equipo de soporte de RESPI cualquier sospecha de brecha de seguridad, uso no autorizado o acceso indebido por parte de terceros.

RESPI se reserva el derecho de suspender o cancelar de forma unilateral aquellas cuentas que aporten datos falsos o que infrinjan de manera reiterada las normas de uso de las instalaciones.

3. FUNCIONAMIENTO DEL SISTEMA DE RESERVAS Y AUTOMATISMOS DEL BACKEND
RESPI opera mediante un motor backend automatizado que ejecuta lógicas de negocio en tiempo real:
• Disponibilidad: Los horarios y pistas mostrados están sujetos a cambios instantáneos según la demanda de los usuarios y las configuraciones del panel de administración.
• Proceso de Reserva: La solicitud de reserva no se considerará formalizada ni confirmada en firme hasta que el backend reciba la confirmación del pago exitoso por parte de la pasarela financiera externa.
• Actualización de Membresías: El backend cuenta con un algoritmo automatizado de fidelización que monitoriza la recurrencia y el volumen de reservas completadas por el Cliente. Al alcanzar los umbrales estipulados por el sistema, el rango de membresía del usuario se elevará o actualizará de manera automática, otorgándole los beneficios asociados a su nuevo estatus.

4. POLÍTICA DE PAGOS, TRANSACCIONES BANCARIAS Y SEGURIDAD (STRIPE)
El procesamiento de los cobros y transacciones económicas dentro de RESPI se realiza de forma delegada y externa a través de la pasarela de pagos segura STRIPE INC. 
• Al introducir sus datos bancarios o tarjetas de crédito, la información se cifra directamente bajo los estándares de seguridad bancaria PCI-DSS y se transmite a los servidores de Stripe.
• El backend de RESPI nunca almacena, registra ni tiene acceso a los números de tarjeta de crédito, fechas de caducidad o códigos de seguridad (CVV) de los Usuarios.
• El Usuario autoriza expresamente a Stripe a realizar el cargo por el importe total reflejado en la pantalla de confirmación antes de la adjudicación de la pista.

5. PROTOCOLO CRÍTICO DE MANTENIMIENTO, CANCELACIONES Y REEMBOLSOS AUTOMÁTICOS
En aquellos casos excepcionales en los que el Administrador de las instalaciones catalogue una pista o zona deportiva bajo el estado de "Mantenimiento" (por averías, inclemencias climáticas, reparaciones estructurales u otras causas de fuerza mayor), se activará el siguiente flujo crítico automatizado en el backend:
• Cancelación Fulminante: El sistema identificará y cancelará de manera inmediata todas las reservas activas asociadas a dicha pista dentro de la franja horaria afectada.
• Orden de Reembolso Automático: El backend emitirá una instrucción instantánea a la API de Stripe para tramitar la devolución íntegra (100%) del importe abonado por el usuario. El dinero se reintegrará en el mismo método de pago original en un plazo que dependerá de la entidad bancaria del usuario.
• Notificaciones de Emergencia: El backend enviará de forma simultánea e imperativa una alerta al dispositivo móvil del usuario para informarle de la incidencia y la ejecución de su reembolso.
El usuario renuncia a reclamar cualquier tipo de indemnización adicional por daños o perjuicios derivados de estas cancelaciones por motivos de mantenimiento técnico.

6. PROPIEDAD INTELECTUAL Y USO PERMITIDO
Todos los derechos de propiedad intelectual e industrial sobre la plataforma RESPI (incluyendo su código fuente backend, bases de datos, algoritmos de cálculo, diseño de interfaces, logotipos, marcas, textos y software asociado) pertenecen en exclusividad a sus desarrolladores y propietarios legítimos. Queda terminantemente prohibido realizar ingeniería inversa, descompilar, extraer datos de forma masiva (scraping), o utilizar la API de RESPI para fines ajenos al uso normal de la aplicación.`;



//--------------------------------------------------------------------------------------------------------------------------------


export const PRIVACY_TEXT = `POLÍTICA DE PRIVACIDAD Y TRATAMIENTO DE DATOS PERSONALES DE LA PLATAFORMA RESPI

Última actualización: Junio de 2026

1. RESPONSABLE DEL TRATAMIENTO DE SUS DATOS
De conformidad con lo dispuesto en el Reglamento General de Protección de Datos (RGPD - Reglamento UE 2016/679) y la Ley Orgánica de Protección de Datos Personales y Garantía de los Derechos Digitales (LOPDGDD 3/2018), el Usuario queda informado de que los datos personales facilitados a través de esta plataforma serán incorporados a un registro de actividades de tratamiento titularidad de la entidad gestora del Backend y Sistema de Reservas de RESPI.
Para cualquier consulta, reclamación o aclaración técnica sobre cómo tratamos sus datos, puede ponerse en contacto de forma directa con nuestro equipo de control a través del correo electrónico de soporte: soporte@respi.com.

2. CATEGORÍA DE DATOS PERSONALES OBJETO DE TRATAMIENTO
Para garantizar el correcto despliegue de las funciones de reserva, facturación e interacción dentro de la Aplicación, el backend recopila y procesa las siguientes categorías de datos:
• Datos de Identificación y Registro: Nombre, apellidos, dirección de correo electrónico y contraseña (almacenada estrictamente bajo un hash de encriptación irreversible en base de datos).
• Datos de Actividad del Sistema: Historial detallado de reservas realizadas, canchas solicitadas, estados de los pagos, estadísticas de uso e incidencias reportadas.
• Datos de Contribución Social: Opiniones, reseñas de texto, valoraciones numéricas (estrellas) sobre el estado de las pistas y las respuestas del administrador asociadas a su perfil.
• Datos Técnicos y de Conectividad: Identificadores únicos de dispositivo (Tokens de notificación para sistemas operativos iOS o Android), dirección IP, modelo de terminal y sistema operativo.

RESPI nunca recopila ni almacena datos de categoría especial (salud, religión, orientación, etc.) ni datos bancarios crudos, delegando esto último de forma segura en Stripe.

3. FINALIDAD LEGÍTIMA DEL TRATAMIENTO DE DATOS
La base legal que legitima el tratamiento de sus datos es la ejecución del contrato de servicios que acepta al registrarse. El backend procesa sus datos estrictamente para las siguientes finalidades esenciales del negocio:
• Gestión Integral de Usuarios: Permitir el registro, autenticación de credenciales, control de accesos a la sesión y personalización del perfil del Cliente.
• Operativa del Motor de Reservas y Pagos: Enviar las solicitudes de cobros a Stripe, procesar la agenda de horarios de las pistas y calcular dinámicamente si su volumen de uso le califica para una subida automatizada en el nivel de Membresía.
• Ejecución del Protocolo de Seguridad por Mantenimiento: En caso de anulación forzosa de un turno por reparaciones en la instalación, utilizar sus datos para emitir la orden de reembolso monetario en Stripe.
• Envío de Notificaciones Push Críticas: Remitir communications inmediatas e indispensables a la pantalla de su dispositivo para informarle de cambios urgentes en sus reservas, alertas de pistas cerradas o confirmaciones de transacciones.
• Moderación y Sistema Social: Publicar sus reseñas y puntuaciones en las fichas públicas de las canchas y habilitar al Administrador para contestar a las mismas.

4. CESIÓN Y TRANSFERENCIA INTERNACIONAL DE DATOS (DESTINATARIOS)
RESPI mantiene un compromiso férreo con la privacidad: sus datos personales nunca serán vendidos, alquilados ni cedidos a empresas de marketing, publicidad o terceros ajenos a la plataforma. No obstante, para que el backend pueda completar sus funciones lógicas básicas, los datos se comunican de forma obligatoria a los siguientes proveedores de servicios:
• Stripe Inc. / Stripe Payments Europe Ltd.: Se comunican los identificadores de cliente y datos esenciales de la transacción financiera con la única finalidad de tramitar los cobros y devoluciones automáticas bajo estrictos protocolos bancarios y de encriptación SSL/TLS.
• Proveedores de Infraestructura Cloud y Notificaciones: Servidores donde se aloja de forma segura la base de datos cifrada y los servicios encargados de la retransisión de las alertas push al terminal móvil.

5. PLAZOS DE CONSERVACIÓN DE LA INFORMACIÓN
Los datos personales facilitados por el Usuario se conservarán de forma activa en el backend de RESPI mientras este mantenga vigente su cuenta en la Aplicación y no solicite la baja del servicio. 
Si el Usuario decide eliminar su cuenta o perfil, sus datos personales serán bloqueados de forma inmediata en las bases de datos activas y se mantendrán únicamente a disposición de las autoridades judiciales o administraciones públicas competentes durante los plazos de prescripción legales para atender posibles responsabilidades derivadas de los pagos o disputas de reservas. Pasado dicho periodo legal, la información será borrada de forma definitiva o anonimizada por completo.

6. DERECHOS DEL USUARIO (DERECHOS ARCO)
El RGPD le otorga pleno control sobre su información. Como Usuario de RESPI, puede ejercer de forma totalmente gratuita los siguientes derechos:
• Acceso: Saber qué datos tenemos guardados sobre usted en el backend.
• Rectificación: Modificar información inexacta o incompleta (como cambiar su nombre de usuario directamente desde el panel de Profile).
• Supresión (Olvido): Solicitar la eliminación completa de su perfil y la destrucción de sus datos de reserva del sistema.
• Oposición y Limitación: Restringir que sus datos se sigan procesando para fines específicos si las circunstancias particulares así lo requieren.

Para ejercitar estos derechos, puede hacerlo modificando los campos editables desde este mismo panel de configuración de Perfil (Profile), o bien enviando un correo electrónico detallado con el asunto "Derechos de Privacidad" a soporte@respi.com desde la misma dirección de email con la que se registró en el sistema.`;