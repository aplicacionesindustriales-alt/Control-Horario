# Control Horario V3.3 Cloud

PWA para partes diarios de trabajo y control horario, con base de datos central Supabase y autenticación individual.

## Funciones

- Parte diario con varias líneas.
- Selección trabajador → proyecto → tarea.
- Restricción de tareas por proyecto.
- Cálculo automático de horas y pausas.
- WhatsApp.
- Histórico y CSV.
- Dashboard.
- Administración de trabajadores, proyectos y tareas.
- PWA instalable en móvil y PC.
- Base central compartida entre empleados.
- Autenticación por usuario.
- RLS por empresa y permisos por rol.
- Copia local compatible con la V3.2.

## Tareas previstas

1. Diseño
2. Fabricación
3. Instalación N/E
4. Montaje
5. Programación
6. Robótica

## Acceso

La aplicación está publicada mediante GitHub Pages:

https://aplicacionesindustriales-alt.github.io/Control-Horario/

Al entrar se puede crear la primera cuenta. La primera cuenta del proyecto se convierte automáticamente en administrador mediante la función protegida `bootstrap-admin`. Las cuentas posteriores requieren un perfil autorizado.

## Arquitectura

- Frontend: HTML/CSS/JavaScript + PWA.
- Backend: Supabase.
- Base de datos: PostgreSQL 17.
- Autenticación: Supabase Auth.
- Seguridad: Row Level Security (RLS).
- Despliegue: GitHub Pages + GitHub Actions.

Detalles técnicos y de configuración: [SUPABASE_SETUP.md](SUPABASE_SETUP.md).

## Seguridad

La aplicación utiliza una clave publishable de Supabase en el navegador. No contiene claves service-role. El acceso a los datos está controlado mediante RLS y roles.

## Publicación

Cada cambio en `main` dispara automáticamente el workflow de GitHub Pages.
