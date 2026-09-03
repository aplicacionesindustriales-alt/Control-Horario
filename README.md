# Control Horario V3.2

PWA estática para partes diarios de trabajo.

## Funciones incluidas

- Parte diario con varias líneas.
- Selección de trabajador, proyecto y tarea mediante listas.
- Restricción de tareas por proyecto.
- Cálculo automático de horas y pausas.
- Envío del parte completo por WhatsApp.
- Histórico local.
- Exportación CSV.
- Administración protegida por PIN configurable.
- Alta y activación/desactivación de trabajadores, proyectos y tareas.
- Numeración automática de proyectos `IM260001` a `IM260100`.
- Copia de seguridad y restauración en JSON.
- Funcionamiento PWA y modo offline mediante Service Worker.

## Datos iniciales

La aplicación se entrega vacía: no contiene trabajadores, proyectos ni tareas de ejemplo.

Las seis tareas previstas pueden darse de alta desde Administración:

1. Diseño
2. Fabricación
3. Instalación N/E
4. Montaje
5. Programación
6. Robótica

## Almacenamiento

Esta primera versión utiliza `localStorage` del navegador. Los datos permanecen en el dispositivo/navegador donde se introducen. La copia de seguridad permite trasladarlos manualmente.

El PIN es una protección de acceso a la interfaz de administración del dispositivo; no debe considerarse un sistema de autenticación de servidor.

## Publicación

El contenido es una aplicación web estática y puede publicarse con GitHub Pages. Tras habilitar Pages para este repositorio usando la rama `main`, el sitio quedará disponible en la URL que GitHub asigne.
