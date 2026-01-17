# Instrucciones de Setup

## 🚀 Instalación Inicial

### 1. Instalar dependencias

```powershell
npm install
```

### 2. Configurar Supabase

#### Opción A: Crear nuevo proyecto

1. Ve a https://app.supabase.com
2. Crea un nuevo proyecto
3. Espera a que se complete la creación (2-3 minutos)

#### Opción B: Usar proyecto existente

1. Ve a tu proyecto en Supabase Dashboard
2. Navega a **SQL Editor**

### 3. Ejecutar el Schema SQL

1. Abre el archivo `supabase/schema.sql`
2. Copia TODO el contenido
3. En Supabase Dashboard → SQL Editor
4. Pega el contenido
5. Click en "Run" o presiona Ctrl+Enter

**Resultado esperado:**

```
Success. No rows returned
```

### 4. Obtener credenciales de API

1. En Supabase Dashboard → Settings → API
2. Copia:
   - **Project URL** (ejemplo: https://abcdefgh.supabase.co)
   - **anon public** key (empieza con `eyJ...`)

### 5. Configurar variables de entorno

```powershell
# Copia el archivo de ejemplo
copy .env.local.example .env.local

# Edita .env.local con tus credenciales
```

Contenido de `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 6. Verificar la instalación

```powershell
npm run type-check
```

Debe decir: "No errors found"

### 7. Ejecutar en desarrollo

```powershell
npm run dev
```

### 8. Abrir en el navegador

Navega a: http://localhost:3000

---

## ✅ Checklist de Verificación

- [ ] Dependencias instaladas (`node_modules` existe)
- [ ] Proyecto de Supabase creado
- [ ] Schema SQL ejecutado sin errores
- [ ] Archivo `.env.local` creado con credenciales válidas
- [ ] `npm run type-check` pasa sin errores
- [ ] Servidor de desarrollo corriendo
- [ ] Página de inicio carga correctamente

---

## 🐛 Troubleshooting

### Error: "Missing Supabase environment variables"

**Solución:** Verifica que `.env.local` existe y tiene las variables correctas

### Error: "relation 'clients' does not exist"

**Solución:** Ejecuta el schema SQL en Supabase

### Error: "Module not found"

**Solución:**

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Puerto 3000 ocupado

**Solución:**

```powershell
# Usar otro puerto
$env:PORT=3001; npm run dev
```

---

## 📚 Recursos

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de Shadcn/ui](https://ui.shadcn.com)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)

---

¡Listo para empezar a desarrollar! 🎉
