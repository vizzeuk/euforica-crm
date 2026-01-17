# 🎨 Sistema de Diseño Euforica
## Guía completa para replicar el estilo en otros sistemas

---

## 📐 Filosofía de Diseño

**Conceptos Clave:**
- **Minimalismo Sofisticado**: Menos es más, cada elemento cuenta
- **Elegancia Atemporal**: Diseño que no pasa de moda
- **Lujo Sutil**: Premium sin ser ostentoso
- **Monocromático con Impacto**: Escala de grises con acentos estratégicos

---

## 🎨 Paleta de Colores

### Colores Principales (HSL)

**Modo Claro:**
```css
--background: 0 0% 100%        /* Blanco puro #FFFFFF */
--foreground: 0 0% 3%          /* Negro casi puro #080808 */

--primary: 0 0% 9%             /* Negro suave #171717 */
--primary-foreground: 0 0% 98% /* Blanco off-white #FAFAFA */

--secondary: 0 0% 96%          /* Gris muy claro #F5F5F5 */
--secondary-foreground: 0 0% 9%

--muted: 0 0% 96%              /* Gris claro #F5F5F5 */
--muted-foreground: 0 0% 45%   /* Gris medio #737373 */

--border: 0 0% 90%             /* Gris borde #E5E5E5 */
--ring: 0 0% 3%                /* Focus ring negro */
```

**Modo Oscuro:**
```css
--background: 0 0% 2%          /* Negro profundo #050505 */
--foreground: 0 0% 98%         /* Blanco casi puro */

--primary: 0 0% 98%
--secondary: 0 0% 15%          /* Gris oscuro #262626 */
--muted: 0 0% 15%
--muted-foreground: 0 0% 64%   /* Gris claro #A3A3A3 */

--border: 0 0% 15%
--input: 0 0% 15%
```

### Uso de Colores (Tailwind/CSS)

```css
/* Fondos */
bg-white            /* Secciones principales */
bg-black            /* Hero, formularios, CTAs */
bg-neutral-50       /* Áreas sutiles */
bg-neutral-100      /* Cards hover */
bg-neutral-900      /* Inputs dark mode */

/* Textos */
text-black          /* Títulos principales */
text-white          /* Texto sobre fondos oscuros */
text-neutral-600    /* Descripciones */
text-neutral-400    /* Metadata, labels */
text-neutral-700    /* Cuerpo de texto */

/* Bordes */
border-neutral-800  /* Líneas sobre negro */
border-neutral-200  /* Líneas sobre blanco */
border-white        /* Elementos seleccionados */
```

---

## ✍️ Tipografía

### Fuentes

**Serif (Títulos y Elegancia):**
```
Familia: Playfair Display
Pesos: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
Variable CSS: --font-playfair
Uso: Títulos principales, hero text, nombres de productos
```

**Sans-serif (Cuerpo y UI):**
```
Familia: Inter
Pesos: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold)
Variable CSS: --font-geist-sans
Uso: Párrafos, botones, formularios, navegación
```

### Jerarquía Tipográfica

```css
/* Hero Titles */
font-serif text-6xl md:text-7xl lg:text-8xl
font-light tracking-tight
line-height: 1.1

/* Section Titles */
font-serif text-5xl md:text-6xl
font-light tracking-tight

/* Subtitles */
font-serif text-3xl md:text-4xl
font-light

/* Card Titles */
font-serif text-2xl
font-medium tracking-tight

/* Body Text */
font-sans text-base (16px)
font-normal leading-relaxed (1.625)

/* Small Text / Metadata */
font-sans text-sm (14px)
text-neutral-400 uppercase tracking-[0.3em]

/* Tiny / Captions */
font-sans text-xs (12px)
text-neutral-500 tracking-wider
```

### Font Features
```css
font-feature-settings: "rlig" 1, "calt" 1;
/* Habilita ligaduras contextuales */
```

---

## 📏 Espaciado y Dimensiones

### Sistema de Espaciado (Tailwind)

```
xs:  4px   (gap-1, p-1)
sm:  8px   (gap-2, p-2)
md:  16px  (gap-4, p-4)
lg:  24px  (gap-6, p-6)
xl:  32px  (gap-8, p-8)
2xl: 48px  (gap-12, p-12)
3xl: 64px  (gap-16, p-16)
4xl: 96px  (gap-24, py-24)
5xl: 128px (py-32)
```

### Secciones
```css
/* Padding vertical de secciones */
py-24 md:py-32    /* Desktop: 128px, Mobile: 96px */

/* Máximo ancho de contenido */
max-w-7xl         /* 1280px para grids */
max-w-4xl         /* 896px para texto centrado */
max-w-2xl         /* 672px para párrafos largos */

/* Márgenes laterales */
px-6              /* 24px en mobile */
px-8 lg:px-12     /* 32-48px en desktop */
```

### Alturas de Hero
```css
h-screen          /* 100vh pantalla completa */
min-h-screen      /* Mínimo pantalla completa */
h-[60vh]          /* 60% altura para hero secundario */
h-[400px]         /* Cards de blog */
```

---

## 🎭 Animaciones y Transiciones

### Duraciones Estándar

```css
/* Ultra rápido */
duration-150     /* 150ms - Hover sutiles */

/* Rápido */
duration-300     /* 300ms - Transiciones UI */

/* Medio */
duration-500     /* 500ms - Cambios de estado */

/* Lento/Elegante */
duration-700     /* 700ms - Imágenes, scale */
duration-1000    /* 1000ms - Fade-ins importantes */
```

### Easing Functions

```css
/* Suaves */
ease-in-out      /* Predeterminado */
ease-out         /* Salida de hover */

/* Con bounce (Framer Motion) */
type: "spring"
stiffness: 100
damping: 10
```

### Animaciones Comunes

**Hover en Imágenes:**
```css
group-hover:scale-105
transition-transform duration-700
```

**Fade In (Framer Motion):**
```jsx
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.8 }}
```

**Overlay en Hover:**
```css
/* De transparente a oscuro */
bg-black/0 hover:bg-black/20
transition-all duration-500
```

**Translate en Hover:**
```css
translate-y-4 opacity-0
group-hover:translate-y-0 group-hover:opacity-100
transition-all duration-500
```

---

## 🧩 Componentes UI

### Botones

**Primary Button (Sobre negro):**
```css
bg-white text-black
hover:bg-neutral-100
px-8 py-4
rounded-full
font-medium
transition-colors duration-300
```

**Secondary Button (Outline):**
```css
border-2 border-neutral-700
bg-transparent text-white
hover:bg-neutral-900
```

**Con Iconos:**
```jsx
<Button>
  Texto
  <ChevronRight className="ml-2 h-4 w-4" />
</Button>
```

### Inputs

```css
bg-neutral-900
text-white
border-neutral-800
rounded-md
px-4 py-3
focus:ring-2 focus:ring-white
transition-all
```

### Cards

**Blog Card:**
```css
/* Container */
group relative overflow-hidden

/* Imagen */
relative h-[400px] overflow-hidden
object-cover transition-transform duration-700
group-hover:scale-105

/* Contenido */
mt-6 space-y-3
font-serif text-2xl tracking-tight
```

**Event Type Card (Seleccionable):**
```css
/* Normal */
border-2 border-neutral-800
bg-transparent
hover:border-neutral-600

/* Seleccionado */
border-white bg-white text-black
```

### Badges/Pills

```css
rounded-full
bg-neutral-100 px-3 py-1
text-xs font-medium uppercase tracking-wider
text-neutral-700
```

---

## 📱 Layout y Responsive

### Grid Systems

**Blog Grid (3 columnas):**
```css
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
gap-8 lg:gap-12
```

**Grid Featured (Hero post grande):**
```css
/* Post destacado ocupa 2x2 */
md:col-span-2 md:row-span-2
```

**Form Grid:**
```css
grid grid-cols-1 md:grid-cols-2 gap-4
```

### Breakpoints

```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

### Container
```css
mx-auto          /* Centrado */
max-w-7xl        /* Límite ancho */
px-6             /* Padding lateral mobile */
lg:px-12         /* Padding lateral desktop */
```

---

## 🎯 Interacciones UX

### Estados de Hover

**Elementos Clicables:**
```css
cursor-pointer
transition-all duration-300
hover:scale-[1.02]
```

**Enlaces:**
```css
text-neutral-600
hover:text-black
underline-offset-4
hover:underline
```

**Imágenes:**
```css
overflow-hidden
scale-100 hover:scale-105
transition-transform duration-700
```

### Estados de Focus

```css
focus:ring-2 focus:ring-white
focus:outline-none
focus-visible:ring-offset-2
```

### Loading States

```jsx
<Loader2 className="mr-2 h-4 w-4 animate-spin" />
```

---

## 🌓 Scrollbar Custom

```css
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #F5F5F5; /* neutral-100 */
}

::-webkit-scrollbar-thumb {
  background: rgba(115, 115, 115, 0.5); /* neutral-500 con opacidad */
  border-radius: 9999px;
}

::-webkit-scrollbar-thumb:hover {
  background: #737373; /* neutral-500 */
}
```

---

## 📐 Border Radius

```css
rounded-none     /* 0px - Imágenes, secciones */
rounded-md       /* 6px - Cards, inputs */
rounded-lg       /* 8px - Modales */
rounded-full     /* 9999px - Botones, badges */
```

---

## 🎨 Efectos Especiales

### Gradientes

**Hero Overlay:**
```css
bg-gradient-to-t from-black/60 via-black/30 to-transparent
```

**Fallback de Imagen:**
```css
bg-gradient-to-br from-neutral-300 via-neutral-200 to-neutral-100
```

### Backdrop Blur
```css
backdrop-blur-md
bg-white/80
```

### Box Shadow (Sutiles)
```css
shadow-sm        /* Elevation baja */
shadow-md        /* Elevation media */
shadow-lg        /* Cards importantes */
```

---

## 🔢 Indicadores de Progreso

**Steps Indicator (Wizard):**
```css
/* Completado */
border-2 border-white bg-white text-black

/* Incompleto */
border-2 border-neutral-700 text-neutral-700

/* Línea de conexión */
h-[2px] w-16 bg-white /* completado */
h-[2px] w-16 bg-neutral-800 /* pendiente */
```

---

## 📝 Ejemplos de Componentes Completos

### Hero Section
```jsx
<section className="relative h-screen overflow-hidden bg-black">
  {/* Video/Imagen de fondo */}
  <div className="absolute inset-0 opacity-40">
    <video autoPlay loop muted playsInline />
  </div>

  {/* Overlay gradient */}
  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

  {/* Contenido */}
  <div className="relative z-10 flex h-full items-center justify-center px-6 text-center text-white">
    <div className="max-w-4xl space-y-8">
      <h1 className="font-serif text-6xl font-light tracking-tight md:text-7xl lg:text-8xl">
        Título Principal
      </h1>
      <p className="text-lg text-neutral-300 md:text-xl">
        Descripción elegante
      </p>
      <Button size="lg" className="bg-white text-black">
        Call to Action
      </Button>
    </div>
  </div>
</section>
```

### Section Title Pattern
```jsx
<div className="mb-16 text-center">
  <p className="mb-4 text-sm uppercase tracking-[0.3em] text-neutral-400">
    Sobretítulo
  </p>
  <h2 className="font-serif text-5xl font-light tracking-tight md:text-6xl">
    Título Principal
    <span className="block font-medium italic">Con Énfasis</span>
  </h2>
</div>
```

---

## 🛠️ Stack Tecnológico

```
Framework: Next.js 16 + React 19
CSS: Tailwind CSS 3.4
Animaciones: Framer Motion
Componentes: Shadcn/UI + Radix UI
Fuentes: Google Fonts (Playfair Display + Inter)
```

---

## 📦 Clases Utility Más Usadas

```css
/* Layouts */
flex items-center justify-center
grid place-items-center
mx-auto max-w-7xl px-6

/* Espaciado consistente */
space-y-8
gap-6 md:gap-12

/* Texto */
text-center
tracking-tight (títulos)
tracking-[0.3em] (labels)
leading-relaxed (párrafos)

/* Transiciones suaves */
transition-all duration-300
ease-in-out

/* Responsive */
hidden md:block
text-base md:text-lg lg:text-xl
```

---

## 🎯 Principios de Implementación

1. **Mobile First**: Diseñar primero para móvil
2. **Consistencia**: Usar el sistema de espaciado siempre
3. **Accesibilidad**: Focus states, ARIA labels, contrast ratio
4. **Performance**: Lazy loading, optimización de imágenes
5. **Animations**: Subtle, never distracting
6. **White Space**: Generoso, permite que el contenido respire

---

## 📸 Referencias Visuales

**Inspiración:**
- Apple.com (minimalismo premium)
- Vercel.com (tipografía y espaciado)
- Stripe.com (animaciones sutiles)
- Kinfolk Magazine (estética editorial)

---

**Última actualización:** 16 Enero 2026  
**Proyecto:** Euforica Landing Page  
**Versión:** 1.0
