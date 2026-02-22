# 💍 Boda de Marta & Sergio

> Una web elegante, moderna e interactiva para la boda del 29 de agosto de 2026 en A Coruña.

---

## 🎨 Características

✨ **Diseño Responsive**: Optimizado para móvil (inspirado en iOS)
🌊 **Estética Playa/Océano**: Tonos azules y gradientes oceánicos
📱 **Menú Sidebar**: Navegación estilo iOS con botón de hamburguesa
🎥 **Video Hero**: Reproductor de vídeo en bucle en la página principal
📸 **Galería Interactiva**: Grid de fotos con filtro por etiquetas
🔐 **Panel Admin**: Edita textos, fotos y gestiona invitados
📋 **RSVP Inteligente**: Búsqueda de invitados sin acentos, confirmación y notas
📧 **Notificaciones**: Emails automáticos para RSVPs
🗺️ **Mapas Embebidos**: Ubicación de la boda y lugares recomendados
🎵 **Spotify**: Playlist embebida para calentar motores
🏖️ **Guía de A Coruña**: Recomendaciones de restaurantes, bares y atracciones

---

## 📁 Estructura del Proyecto

```
weddingwebsite/
├── public/
│   └── assets/              # Imágenes, vídeos y recursos estáticos
├── src/
│   ├── components/          # Componentes React reutilizables
│   ├── pages/               # Páginas y rutas
│   │   └── api/             # API routes (backend)
│   ├── styles/              # Estilos CSS
│   ├── utils/               # Funciones utilitarias
│   └── data/                # Datos JSON (invitados, galerías, textos)
├── DEPLOYMENT.md            # Manual de despliegue
├── README.md                # Este archivo
├── package.json             # Dependencias
├── tsconfig.json            # Configuración TypeScript
├── next.config.js           # Configuración Next.js
└── .env.example             # Variables de entorno ejemplo
```

---

## 🚀 Inicio Rápido

### 1. Instalación

```bash
# Clona el repositorio (si está en GitHub)
git clone <url-del-repo>
cd weddingwebsite

# Instala dependencias
npm install
```

### 2. Desarrollo Local

```bash
# Inicia el servidor de desarrollo
npm run dev

# Abre http://localhost:3000 en el navegador
```

### 3. Acceso Admin

- URL: `http://localhost:3000/admin`
- Usuario: `admin`
- Contraseña: `Hjk908`

### 4. Build para Producción

```bash
# Compila el proyecto
npm run build

# Inicia el servidor de producción
npm start
```

---

## 🎯 Páginas

| Página | Ruta | Descripción |
|--------|------|-------------|
| **Inicio** | `/` | Página principal con video hero |
| **Confirmar Asistencia** | `/rsvp` | Formulario de RSVP |
| **Información** | `/info` | Cómo llegar, regalo, playlist |
| **Galería** | `/gallery` | Grid de fotos con filtro por etiquetas |
| **Sobre A Coruña** | `/coruna` | Guía de la ciudad |
| **Login Admin** | `/admin` | Acceso al panel administrativo |
| **Panel Admin** | `/admin-panel` | Edición de contenido |

---

## 🔧 Configuración

### Variables de Entorno

Crea archivo `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
RESEND_API_KEY=tu_clave_aqui
BLOB_READ_WRITE_TOKEN=tu_token_blob_aqui
# Opcional: public o private (por defecto: private)
BLOB_OBJECT_ACCESS=private
```

Ver `.env.example` para más opciones.

### Cambiar Credenciales Admin

En `src/pages/api/auth/login.ts`:

```typescript
const ADMIN_USER = 'tuUsuario';
const ADMIN_PASSWORD = 'tuContraseña';
```

---

## 📦 Dependencias Principales

- **Next.js 14**: Framework React para producción
- **React 18**: Librería de UI
- **TypeScript**: Tipado estático de JavaScript
- **CSS Modular**: Estilos sin dependencias externas

---

## 🎨 Customización

### Cambiar Colores

En `src/styles/theme.css`:

```css
:root {
  --color-primary: #006B8E;      /* Color principal */
  --color-secondary: #00838F;    /* Color secundario */
  /* ... más colores ... */
}
```

### Cambiar Textos

En `src/data/texts.json` o desde el panel admin.

### Cambiar Invitados

En `src/data/guests.json` o desde el panel admin.

### Cambiar Imágenes

Reemplaza archivos en `public/assets/`:

```
foto01.png → Foto principal
foto02.png → Foto secundaria
imagen01.png → Sección info
imagen02.png → Ubicación bus
imagen03.png → A Coruña hero
```

---

## 📱 Responsive Design

La web está optimizada para:

- 📱 Móviles (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)

Testing recomendado con Chrome DevTools (F12 > Toggle Device Toolbar).

---

## 🔐 Seguridad

✅ **HTTPS**: Automático en Vercel
✅ **Admin Seguro**: Credenciales en servidor
✅ **Validación**: Datos validados en cliente y servidor
✅ **Headers de Seguridad**: Configurados en next.config.js
✅ **Rate Limiting**: Implementable en Vercel (Edge Middleware)

---

## 📊 APIs Disponibles

### Guests (Invitados)
```
GET /api/guests              # Obtener todos
POST /api/guests             # Crear uno
PUT /api/guests/:id          # Actualizar
DELETE /api/guests/:id       # Eliminar
```

### Gallery (Galería)
```
GET /api/gallery             # Obtener todas
POST /api/gallery            # Crear una
DELETE /api/gallery/:id      # Eliminar
POST /api/gallery/upload     # Subir foto
```

### RSVP
```
POST /api/rsvp/submit        # Registrar confirmación
```

### Texts (Textos)
```
GET /api/texts               # Obtener todos
PUT /api/texts/:id           # Actualizar
```

### Auth (Autenticación)
```
POST /api/auth/login         # Login admin
```

### Email
```
POST /api/email/send         # Enviar email
```

---

## 🚀 Despliegue

Ver `DEPLOYMENT.md` para instrucciones detalladas en Vercel.

**Resumen rápido:**
1. Crea cuenta en https://vercel.com
2. Conecta tu repositorio GitHub
3. Click en "Deploy"
4. ¡Listo! Disponible en `https://weddingwebsite.vercel.app`

---

## 🔄 CI/CD

Con Vercel + GitHub, cada push automáticamente:

1. Ejecuta build
2. Corre tests (si los hay)
3. Deploya a producción
4. Invalida cachés

---

## 📈 Analytics

Vercel proporciona:

- Visitantes únicos
- Países de origen
- Dispositivos
- Fuentes de tráfico
- Performance metrics

---

## 🐛 Debugging

### Logs Locales

```bash
npm run dev

# Verás logs en la terminal
```

### Logs en Vercel

Dashboard > Project > Functions > Logs

### DevTools

En el navegador: F12 para inspeccionar elementos y network.

---

## 📝 Notas Importantes

- **Invitados**: Actualiza `src/data/guests.json` antes del despliegue
- **Imágenes**: Optimiza tamaño (máx 5MB por foto)
- **Vídeo Hero**: Puede ser pesado - asegúrate de comprimirlo
- **Email**: Requiere configurar Resend para producción
- **Admin**: Cambia contraseña antes de publicar

---

## 🎓 Recursos Útiles

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MDN Web Docs](https://developer.mozilla.org)

---

## 📞 Contacto & Soporte

Si tienes problemas:

1. Revisa los logs (terminal o Vercel dashboard)
2. Verifica variables de entorno
3. Consulta la documentación de las librerías usadas
4. Abre un issue en GitHub

---

## 📄 Licencia

Este proyecto está hecho con ❤️ para la boda de Marta & Sergio.

---

## 🎉 ¡Que disfrutes tu boda!

Hecha con amor, Next.js y muchos gradientes azules 🌊💍

_Última actualización: Febrero 2026_
_Versión: 1.0.0_
