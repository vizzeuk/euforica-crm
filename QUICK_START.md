# 🚀 GUÍA RÁPIDA - Deploy EUFORICA CRM

## ⚡ 3 Pasos para tener tu CRM en la nube

### 🔐 PASO 1: Configurar Autenticación (5 minutos)

#### 1.1 Ejecutar SQL en Supabase

```
1. Abre: https://supabase.com/dashboard
2. Tu proyecto → SQL Editor
3. Copia todo de: supabase/auth-setup.sql
4. Pega en el editor
5. Click RUN ✅
```

#### 1.2 Crear Usuarios del Equipo

```
1. Authentication → Users → Add User
2. Email: juan@euforica.com
3. Password: TuContraseña123! (mínimo 6 caracteres)
4. Create User ✅
5. Repite para cada persona del equipo
```

**💾 GUARDA las credenciales - las necesitarás para login**

---

### 📦 PASO 2: Subir a GitHub (2 minutos)

#### 2.1 Crear Repositorio en GitHub

```
1. Ve a: https://github.com/new
2. Nombre: euforica-crm
3. NO marques "Initialize with README"
4. Create repository ✅
```

#### 2.2 Conectar Código (Ya hicimos git init)

```powershell
# Copia EXACTAMENTE estos comandos (reemplaza TU_USUARIO)
git remote add origin https://github.com/TU_USUARIO/euforica-crm.git
git branch -M main
git push -u origin main
```

**✅ Tu código ya está en GitHub**

---

### 🌐 PASO 3: Deploy en Vercel (5 minutos)

#### 3.1 Importar desde GitHub

```
1. Abre: https://vercel.com/new
2. Import Git Repository
3. Selecciona: euforica-crm
4. Import ✅
```

#### 3.2 Configurar Variables de Entorno (IMPORTANTE)

**Antes de Deploy, agrega estas variables:**

```
NEXT_PUBLIC_SUPABASE_URL=https://dcpfdbkwqnkbhnlmxrnt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

**¿Dónde las consigo?**

1. Supabase → Settings ⚙️ → API
2. Copia "Project URL" → pega en NEXT_PUBLIC_SUPABASE_URL
3. Copia "anon public" → pega en NEXT_PUBLIC_SUPABASE_ANON_KEY

#### 3.3 Deploy

```
1. Verifica que las variables estén agregadas
2. Click Deploy
3. Espera 2-3 minutos ⏳
4. ¡Listo! 🎉
```

**Tu app estará en:** `https://euforica-crm-tu-usuario.vercel.app`

---

## 🔑 PASO 4: Acceder al Sistema

### Para TI:

1. Abre tu URL de Vercel
2. Login con las credenciales que creaste
3. ¡Bienvenido al dashboard! 🎉

### Para TU EQUIPO:

Comparte:

- ✅ URL: `https://tu-app.vercel.app`
- ✅ Email y contraseña individual de cada usuario

---

## 📱 ¿Qué puede hacer tu equipo ahora?

- ✅ Ver el dashboard con métricas en tiempo real
- ✅ Gestionar leads en el pipeline Kanban
- ✅ Buscar y editar leads
- ✅ Crear nuevos leads manualmente
- ✅ Todo desde cualquier dispositivo con internet

---

## 🔄 Actualizaciones Futuras

Cuando hagas cambios al código:

```powershell
git add .
git commit -m "Descripción del cambio"
git push
```

**Vercel detecta el push y actualiza automáticamente en 2 minutos**

---

## ✅ Checklist Final

- [ ] ✅ Ejecutar auth-setup.sql en Supabase
- [ ] ✅ Crear usuarios en Supabase (Authentication > Users)
- [ ] ✅ Git push hecho
- [ ] ✅ Proyecto importado en Vercel
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ Deploy exitoso
- [ ] ✅ Login probado
- [ ] ✅ URL compartida con el equipo

---

## 🆘 ¿Problemas?

### "Build failed en Vercel"

→ Verifica que AMBAS variables de entorno estén configuradas

### "Invalid credentials al hacer login"

→ Usuario debe estar en Supabase > Authentication > Users

### "Cannot access after deployment"

→ Supabase > Settings > API > Allow Client-side Auth debe estar ON

---

**¡Tu equipo EUFORICA ya puede trabajar desde cualquier lugar! 🚀**

Cualquier duda, revisa: **DEPLOYMENT_GUIDE.md** (guía detallada)
