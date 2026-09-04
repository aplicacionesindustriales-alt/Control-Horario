# Control Horario V3.2

PWA para partes diarios de trabajo, preparada para instalarse en móviles y ordenadores sin instalar un programa tradicional.

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
- Código de proyecto independiente y editable, con propuesta automática de numeración.
- Copia de seguridad y restauración en JSON.
- Funcionamiento PWA y modo offline mediante Service Worker.
- Instalación en Android, iPhone/iPad, Windows y otros equipos compatibles con PWA.

## Datos iniciales

La aplicación se entrega vacía: no contiene trabajadores, proyectos ni tareas de ejemplo.

Las seis tareas previstas pueden darse de alta desde Administración:

1. Diseño
2. Fabricación
3. Instalación N/E
4. Montaje
5. Programación
6. Robótica

## Instalación y distribución

La aplicación se distribuye mediante un único enlace de GitHub Pages:

https://aplicacionesindustriales-alt.github.io/Control-Horario/

El trabajador abre el enlace desde su móvil o PC y utiliza la opción **Instalar aplicación** o **Añadir a pantalla de inicio** del navegador.

No se necesita APK, EXE ni instalación manual de archivos.

Las instrucciones completas están en [INSTALACION.md](INSTALACION.md).

## Almacenamiento

Esta versión utiliza `localStorage` del navegador. Los datos permanecen en el dispositivo/navegador donde se introducen. La copia de seguridad permite trasladarlos manualmente a otro dispositivo.

El PIN es una protección de acceso a la interfaz de administración del dispositivo; no debe considerarse un sistema de autenticación de servidor.

## Publicación

El repositorio utiliza GitHub Pages mediante GitHub Actions. Cada cambio realizado en `main` se publica automáticamente cuando finaliza correctamente el flujo de despliegue.
