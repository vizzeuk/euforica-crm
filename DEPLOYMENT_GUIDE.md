# 🚀 EUFORICA CRM - Despliegue en Vercel con GitHub

Esta guía te ayudará a configurar el sistema en Vercel con autenticación segura.

## 📋 Prerequisitos

- Cuenta en [GitHub](https://github.com)
- Cuenta en [Vercel](https://vercel.com)
- Cuenta en [Supabase](https://supabase.com)
- Git instalado en tu computadora

---

## 🔐 PASO 1: Configurar Autenticación en Supabase

### 1.1 Ejecutar SQL de Autenticación

1. Ve a tu proyecto Supabase: https://supabase.com/dashboard
2. Click en **SQL Editor** en el menú lateral
3. Abre el archivo `supabase/auth-setup.sql` de este proyecto
4. Copia todo el contenido y pégalo en el editor SQL
5. Click en **RUN** para ejecutar el script

Esto habilitará Row Level Security (RLS) en tu base de datos para que solo usuarios autenticados puedan acceder.

### 1.2 Crear Usuarios del Equipo

1. En Supabase, ve a **Authentication** > **Users**
2. Click en **Add User**
3. Ingresa el email y contraseña para cada miembro del equipo:
   - Email: `juan@euforica.com`
   - Contraseña: `TuContraseñaSegura123!` (mínimo 6 caracteres)
4. Click en **Create User**
5. Repite para cada miembro del equipo

**IMPORTANTE:** Guarda estas credenciales de forma segura. Cada persona del equipo usará estas credenciales para iniciar sesión.

---

## 📦 PASO 2: Subir Proyecto a GitHub

### 2.1 Inicializar Repositorio Git

Abre PowerShell en la carpeta del proyecto y ejecuta:

\`\`\`powershell
# Inicializar git
git init

# Agregar todos los archivos
git add .

# Hacer commit inicial
git commit -m "Initial commit: EUFORICA CRM with authentication"
\`\`\`

### 2.2 Crear Repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre del repositorio: `euforica-crm`
3. **NO** marques "Initialize with README" (ya tenemos archivos)
4. Click en **Create repository**

### 2.3 Conectar y Subir Código

GitHub te mostrará comandos. Ejecuta esto en PowerShell:

\`\`\`powershell
# Agregar origen remoto (reemplaza TU_USUARIO con tu nombre de usuario de GitHub)
git remote add origin https://github.com/TU_USUARIO/euforica-crm.git

# Renombrar rama a main
git branch -M main

# Subir código
git push -u origin main
\`\`\`

---

## 🌐 PASO 3: Desplegar en Vercel

### 3.1 Importar Proyecto desde GitHub

1. Ve a https://vercel.com/new
2. Click en **Import Git Repository**
3. Selecciona tu repositorio `euforica-crm`
4. Click en **Import**

### 3.2 Configurar Variables de Entorno

**CRÍTICO:** Antes de hacer deploy, agrega estas variables de entorno:

En la sección **Environment Variables**, agrega:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://dcpfdbkwqnkbhnlmxrnt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
\`\`\`

**¿Dónde encuentro estas variables?**

1. Ve a tu proyecto Supabase
2. Click en **Settings** (⚙️) > **API**
3. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3.3 Hacer Deploy

1. Asegúrate de que las variables estén configuradas
2. Click en **Deploy**
3. Espera 2-3 minutos mientras Vercel construye el proyecto
4. ¡Listo! Tu app estará en una URL como `https://euforica-crm.vercel.app`

---

## 🔑 PASO 4: Usar el Sistema

### 4.1 Acceder por Primera Vez

1. Ve a tu URL de Vercel (ej: `https://euforica-crm.vercel.app`)
2. Serás redirigido automáticamente a `/login`
3. Ingresa el email y contraseña que creaste en Supabase
4. Click en **Iniciar Sesión**
5. ¡Bienvenido al dashboard!

### 4.2 Dar Acceso al Equipo

Comparte con tu equipo:
- ✅ URL de la app: `https://tu-app.vercel.app`
- ✅ Credenciales individuales (email + contraseña)

Cada persona deberá:
1. Abrir la URL
2. Iniciar sesión con sus credenciales
3. Ya pueden usar el sistema

---

## 🔒 Seguridad Implementada

✅ **Autenticación requerida:** No se puede acceder al dashboard sin login
✅ **Row Level Security:** Solo usuarios autenticados pueden ver/modificar datos
✅ **Middleware de protección:** Redirige automáticamente a login si no hay sesión
✅ **Variables de entorno seguras:** Credenciales nunca en el código
✅ **Sesión persistente:** No necesitas login cada vez que entras

---

## 🛠️ Actualizaciones Futuras

Cuando hagas cambios al código:

\`\`\`powershell
# Agregar cambios
git add .

# Hacer commit con mensaje descriptivo
git commit -m "Descripción de tus cambios"

# Subir a GitHub
git push
\`\`\`

**Vercel detectará automáticamente los cambios** y hará deploy en 2-3 minutos.

---

## 🆘 Solución de Problemas

### "Cannot find module @supabase/auth-helpers-nextjs"
\`\`\`powershell
npm install @supabase/auth-helpers-nextjs
\`\`\`

### "Build failed on Vercel"
- Verifica que las variables de entorno estén configuradas
- Revisa los logs en Vercel para ver el error específico

### "Invalid credentials" al hacer login
- Verifica que el usuario esté creado en Supabase > Authentication > Users
- La contraseña debe tener mínimo 6 caracteres
- El email debe ser exactamente igual al registrado

### "Cannot access after deployment"
- Ve a Supabase > Settings > API > **Allow Client-side Auth**
- Asegúrate de que esté habilitado

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Vercel: https://vercel.com/dashboard
2. Revisa la consola del navegador (F12)
3. Verifica que las variables de entorno estén correctas

---

## ✅ Checklist de Despliegue

- [ ] Ejecutar `auth-setup.sql` en Supabase
- [ ] Crear usuarios del equipo en Supabase Authentication
- [ ] Inicializar Git (`git init`, `git add .`, `git commit`)
- [ ] Crear repositorio en GitHub
- [ ] Conectar y subir código (`git remote add origin`, `git push`)
- [ ] Importar proyecto en Vercel desde GitHub
- [ ] Configurar variables de entorno en Vercel
- [ ] Hacer deploy en Vercel
- [ ] Probar login con un usuario
- [ ] Compartir URL y credenciales con el equipo

---

¡Tu sistema EUFORICA CRM está listo para ser usado por todo el equipo de forma segura! 🎉
