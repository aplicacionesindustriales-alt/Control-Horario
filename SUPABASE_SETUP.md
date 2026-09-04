# Control Horario V3.3 — Supabase

La V3.3 utiliza Supabase como base de datos central y mantiene la PWA de GitHub Pages como interfaz.

## Proyecto

- Nombre: `Control Horario`
- Región: Europa (`eu-west-1`)
- Project ref: `zvekdqiotliotlesubnp`
- API URL: `https://zvekdqiotliotlesubnp.supabase.co`

La clave publishable está en `supabase-config.js`. No se debe publicar nunca una service-role key en el navegador.

## Base de datos

Se han creado las tablas `companies`, `profiles`, `employees`, `projects`, `tasks`, `project_tasks`, `timesheets`, `timesheet_lines`, `audit_log` y `app_settings`, con RLS y aislamiento por empresa.

También están activas las tareas iniciales:

- Diseño
- Fabricación
- Instalación N/E
- Montaje
- Programación
- Robótica

## Primer acceso

1. Abrir la aplicación.
2. Crear una cuenta con email y contraseña.
3. Si es la primera cuenta del proyecto, se convierte automáticamente en administrador mediante la función protegida `bootstrap-admin`.
4. El administrador puede trabajar con trabajadores, proyectos y tareas.
5. Los partes se almacenan en Supabase y quedan disponibles según el rol.

## Roles

- `worker`: puede trabajar con sus propios partes.
- `manager`: puede consultar y gestionar los partes del equipo.
- `admin`: administración completa de la empresa.

## GitHub Pages

La aplicación carga el cliente oficial de Supabase desde CDN y conserva la PWA y el modo local como base de compatibilidad. El service worker no cachea respuestas de Supabase.

## Seguridad

RLS está habilitado en todas las tablas de negocio. Las funciones de seguridad utilizan `SECURITY DEFINER` únicamente para resolver el contexto de empresa/usuario dentro de las políticas. La función `bootstrap-admin` requiere JWT y solo puede crear el primer administrador.

## Importante

La migración automática de los datos antiguos de `localStorage` no debe hacerse de forma indiscriminada: los dispositivos pueden contener trabajadores o partes distintos. En V3.3 la carga inicial debe realizarse desde el administrador y después todos los usuarios trabajan contra la misma base central.
