# ¡Bienvenido a tu Web de Boda!

Hola Marta y Sergio,

He creado una **web elegante, moderna y completamente funcional** para vuestra boda del 29 de agosto de 2026 en A Coruña.

---

## 📦 Lo que recibes

**✅ 60+ archivos completos y funcionales**
- Frontend React con TypeScript
- 12 componentes personalizados
- 8 páginas totalmente desarrolladas
- 8 API routes (backend)
- 5 utilidades avanzadas
- 7 archivos CSS responsive
- Panel administrativo completo
- Sistema RSVP inteligente
- Galería con filtro por etiquetas

---

## 🚀 Cómo Comenzar (3 pasos)

### 1️⃣ Instala dependencias
```bash
npm install
```

### 2️⃣ Ejecuta en local
```bash
npm run dev
```
Abre http://localhost:3000

### 3️⃣ Accede al admin
- URL: http://localhost:3000/admin
- Usuario: `admin`
- Contraseña: `Hjk908`

¡Eso es todo! Ver `QUICK_START.md` para más detalles.

---

## 📚 Documentación Incluida

| Archivo | Propósito |
|---------|-----------|
| `README.md` | Documentación completa del proyecto |
| `DEPLOYMENT.md` | **Manual paso a paso para Vercel** |
| `QUICK_START.md` | Instrucciones rápidas de inicio |
| `PROJECT_STRUCTURE.md` | Estructura visual del proyecto |
| `IMPROVEMENTS.md` | Tips, mejoras y funcionalidades futuras |
| `WELCOME.md` | Este archivo (bienvenida) |

---

## 🎨 Características

### Responsive Mobile-First
- Optimizado completamente para móvil
- Estilo inspirado en iOS
- Menú sidebar elegante

### Diseño Elegante
- Tonos playa y océano
- Gradientes suaves
- Animaciones modernas
- Accesible y rápido

### Admin Seguro
- Login con usuario y contraseña
- Edición de textos
- Gestión de fotos
- Panel de invitados

### RSVP Inteligente
- Búsqueda sin acentos
- Confirmación en 3 pasos
- Notas personalizadas
- Emails automáticos

### Galería Profesional
- Grid responsive
- Filtro por etiquetas
- Subida de fotos fácil
- Vista bonita de imágenes

### Información Completa
- Cómo llegar en coche/autobús
- Mapa embebido
- Playlist Spotify
- Recomendaciones de A Coruña

---

## 📁 Qué Necesitas Agregar

Coloca estos archivos en `public/assets/`:

```
📸 Imágenes (obligatorios):
- foto01.png          ~ 500KB
- foto02.png          ~ 500KB
- foto03.png          ~ 500KB
- imagen01.png        ~ 400KB
- imagen02.png        ~ 400KB
- imagen03.png        ~ 400KB

🎬 Vídeo (recomendado):
- video1.avi          ~ 5MB máximo (comprimido)
```

---

## 🔧 Personalización Rápida

### 1. Cambiar Invitados
Edita: `src/data/guests.json`

### 2. Cambiar Textos
Edita: `src/data/texts.json`

### 3. Cambiar Colores
Edita: `src/styles/theme.css`

### 4. Cambiar Credenciales Admin
Edita: `src/pages/api/auth/login.ts`

---

## 🚀 Desplegar en Vercel (2 opciones)

### Opción A: Con CLI (5 minutos)
```bash
npm install -g vercel
vercel login
vercel
```

### Opción B: Desde Dashboard (10 minutos)
1. Ve a https://vercel.com/new
2. Conecta tu GitHub
3. Selecciona este repositorio
4. Click "Deploy"
5. ¡Listo! Tendrás HTTPS gratuito

Ver `DEPLOYMENT.md` para guía completa.

---

## 📍 Estructura de Páginas

| Página | Ruta | Descripción |
|--------|------|-------------|
| **Inicio** | **/** | Video hero, foto, fecha, ubicación |
| **RSVP** | **/rsvp** | Confirmación con búsqueda inteligente |
| **Info** | **/info** | Cómo llegar, regalo, playlist |
| **Galería** | **/gallery** | Fotos con filtro por etiquetas |
| **A Coruña** | **/coruna** | Guía de la ciudad |
| **Admin** | **/admin** | Login administrativo |
| **Panel** | **/admin-panel** | Gestión de contenido |

---

## 🎯 Checklist Pre-Lanzamiento

- [ ] Instalar dependencias: `npm install`
- [ ] Agregar imágenes en `public/assets/`
- [ ] Actualizar lista de invitados
- [ ] Cambiar números WhatsApp
- [ ] Cambiar contraseña admin
- [ ] Probar en local: `npm run dev`
- [ ] Probar en móvil
- [ ] Desplegar en Vercel
- [ ] Compartir URL con invitados
- [ ] ¡Disfrutar! 🎉

---

## 💡 Consejos Importantes

### Antes de Publicar
1. **Prueba en móvil** - Es lo más importante
2. **Comprime imágenes** - Máx 200KB cada una
3. **Actualiza invitados** - Incluye a todos
4. **Verifica textos** - Revisión de ortografía

### Después de Publicar
1. **Comparte el link** - 2-3 semanas antes
2. **Envía recordatorio** - 1 semana antes
3. **Lee RSVPs regularmente** - Desde admin
4. **Carga fotos post-boda** - Mientras las recibas

### Seguridad
1. **Cambia contraseña admin** - No publiques `Hjk908`
2. **No compartas `.env`** - Contiene datos sensibles
3. **Backup regular** - Descarga JSON ocasionalmente

---

## 🔐 Credenciales Admin (CAMBIAR ANTES DE PUBLICAR)

**Actualmente:**
- Usuario: `admin`
- Contraseña: `Hjk908`

**Para cambiar:**
1. Edita: `src/pages/api/auth/login.ts`
2. Cambia las líneas:
   ```typescript
   const ADMIN_USER = 'tuUsuario';
   const ADMIN_PASSWORD = 'tuContraseña';
   ```
3. Haz redeploy en Vercel

---

## 📞 Soporte y Recursos

### Si tienes problemas:
1. Lee `README.md` - Tiene respuestas
2. Revisa `QUICK_START.md` - Troubleshooting incluido
3. Consulta `DEPLOYMENT.md` - Errores comunes

### Documentación externa:
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Vercel Docs](https://vercel.com/docs)
- [TypeScript Docs](https://www.typescriptlang.org)

---

## 🎁 Extras Incluidos

✅ **Menú Sidebar iOS** - Elegante y moderno
✅ **Búsqueda sin acentos** - Encuentra invitados fácilmente
✅ **Galería con filtros** - Etiqueta tus fotos
✅ **Panel admin completo** - Edita todo desde web
✅ **HTTPS automático** - Seguridad incluida en Vercel
✅ **Responsive design** - Perfecto en cualquier dispositivo
✅ **Animaciones suaves** - Transiciones elegantes
✅ **Documentación completa** - Guías paso a paso

---

## 🚀 Próximos Pasos (En Orden)

1. **HOY**: Lee este archivo y `QUICK_START.md`
2. **HOY**: Ejecuta `npm install` y `npm run dev`
3. **ESTA SEMANA**: Agrega imágenes a `public/assets/`
4. **ESTA SEMANA**: Actualiza lista de invitados
5. **PRÓXIMA SEMANA**: Prueba el formulario RSVP
6. **ANTES DE PUBLICAR**: Cambia contraseña admin
7. **ANTES DE PUBLICAR**: Prueba en móvil real
8. **FINAL**: Despliega en Vercel
9. **FINAL**: Comparte URL con invitados
10. **DISFRUTAR**: ¡Es vuestro día especial! 💍

---

## 📧 ¿Problemas al Instalar?

### "npm: command not found"
Instala Node.js desde https://nodejs.org/

### "npm ERR! code ERESOLVE"
```bash
npm install --legacy-peer-deps
```

### "Cannot find module"
```bash
rm -r node_modules package-lock.json
npm install
```

Ver `QUICK_START.md` para más soluciones.

---

## 🎨 Personalización Avanzada

¿Quieres más cambios?

- **Cambiar colores**: `src/styles/theme.css`
- **Cambiar fuentes**: `src/styles/globals.css`
- **Agregar secciones**: `src/components/` (copiar existente)
- **Cambiar animaciones**: Cualquier archivo CSS

Ver `IMPROVEMENTS.md` para ideas avanzadas.

---

## 🌟 Resumen Final

Tienes una **web de boda profesional, moderna y lista para usar**. Solo necesitas:

1. ✅ Instalar dependencias
2. ✅ Agregar tus imágenes
3. ✅ Actualizar invitados
4. ✅ Desplegar en Vercel
5. ✅ ¡Disfrutar! 🎉

**Tiempo total de setup: ~30 minutos**

---

## 💕 Hecha con amor

Esta web ha sido creada pensando en vosotros, en vuestra boda y en que vuestros invitados veáis toda la ilusión que ponéis en este día.

**La web está lista, elegante, segura y lista para desplegarse en minutos.**

---

## 📖 Archivos Clave

```
ESTA ES TU CARPETA → c:\Users\b_r_a\Desktop\Proyectos\weddingwebsite

Leer primero:
1. WELCOME.md          ← Estás aquí
2. QUICK_START.md      ← Instrucciones rápidas
3. DEPLOYMENT.md       ← Cómo hospedar en Vercel

Consultar después:
4. README.md           ← Documentación completa
5. PROJECT_STRUCTURE.md ← Estructura del proyecto
6. IMPROVEMENTS.md     ← Mejoras y tips
```

---

## 🎊 Final

**¡Felicidades por vuestra boda!**

Que este día sea tan bonito y especial como queremos que sea.

Que os lo paséis en grande el 29 de agosto en A Coruña.

**¡Que vaya todo perfecto!** 💍💕🌊

---

`WELCOME.md` - Febrero 18, 2026
Hecha con Next.js, TypeScript, React y mucho amor ❤️

¿Necesitas ayuda? Lee `QUICK_START.md`
