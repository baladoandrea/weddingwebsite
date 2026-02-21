# 🚀 Instrucciones Rápidas de Inicio

## 1️⃣ Configuración Inicial

### Instalar dependencias
```bash
npm install
```

### Crear .env.local
```bash
cp .env.example .env.local
```

### Ejecutar en desarrollo
```bash
npm run dev
```

Luego abre: http://localhost:3000

---

## 2️⃣ Acceder al Panel Admin

- **URL**: http://localhost:3000/admin
- **Usuario**: `admin`
- **Contraseña**: `Hjk908`

---

## 3️⃣ Agregar Imágenes y Vídeo

Coloca los archivos en `public/assets/`:

```
📁 public/
  📁 assets/
    ✅ foto01.png           # Foto principal
    ✅ foto02.png           # Foto secundaria
    ✅ foto03.png           # Tercera foto
    ✅ imagen01.png         # Sección "Información"
    ✅ imagen02.png         # Ubicación autobús
    ✅ imagen03.png         # Hero A Coruña
    ✅ video1.avi           # Vídeo principal
```

---

## 4️⃣ Personalizar Invitados

Edita `src/data/guests.json`:

```json
[
  {
    "id": "1",
    "name": "Tu Nombre Completo",
    "attendance": "",
    "notes": "",
    "image": "/assets/thank-you-1.png"
  }
]
```

O usa el panel admin para gestionar.

---

## 5️⃣ Personalizar Textos

Edita `src/data/texts.json` o usa el panel admin.

---

## 6️⃣ Personalizar Colores

En `src/styles/theme.css`:

```css
:root {
  --color-primary: #006B8E;      /* Cambia aquí */
  --color-secondary: #00838F;
  /* más variables... */
}
```

---

## 7️⃣ Build para Producción

```bash
# Compila el proyecto
npm run build

# Inicia servidor de producción (local)
npm start
```

---

## 8️⃣ Desplegar en Vercel

### Opción A: Con CLI
```bash
npm install -g vercel
vercel login
vercel
```

### Opción B: Desde Dashboard
1. Crea cuenta en https://vercel.com
2. Conecta tu GitHub
3. Selecciona este repositorio
4. Click en "Deploy"
5. ¡Listo!

Ver `DEPLOYMENT.md` para instrucciones detalladas.

---

## 9️⃣ Configurar Vercel Blob (OBLIGATORIO para panel admin)

Sin esta variable no funcionará correctamente:
- Guardar textos desde el panel admin
- Subir fotos a la galería

### En Vercel Dashboard
1. Abre tu proyecto en Vercel
2. Ve a `Storage` → `Blob`
3. Crea o selecciona un Blob Store
4. Pulsa `Connect Project` (si aún no está conectado)
5. Ve a `Settings` → `Environment Variables`
6. Añade:
  - **Name**: `BLOB_READ_WRITE_TOKEN`
  - **Value**: token generado por Vercel Blob
  - **Environment**: `Production` (y recomendable también `Preview` + `Development`)
7. Haz **Redeploy** del proyecto

### En local (`.env.local`)
```bash
BLOB_READ_WRITE_TOKEN=tu_token_real_de_vercel_blob
```

Reinicia `npm run dev` después de añadir la variable.

---

## 🔐 Cambiar Credenciales Admin

En `src/pages/api/auth/login.ts`:

```typescript
const ADMIN_USER = 'tuUsuario';
const ADMIN_PASSWORD = 'tuContraseña';
```

Luego redeploy.

---

## 📱 Testear en Móvil

### Desde local
1. Obtén tu IP local: `ipconfig` (Windows) o `ifconfig` (Mac/Linux)
2. Abre en móvil: `http://TU_IP:3000`

### Desde Vercel
1. Copia URL de tu deployment
2. Abre en móvil: `https://weddingwebsite.vercel.app`

---

## 🐛 Troubleshooting

### "Cannot find module"
```bash
rm -r node_modules package-lock.json
npm install
```

### "Port 3000 already in use"
```bash
npm run dev -- -p 3001
# O abre http://localhost:3001
```

### Las imágenes no se cargan
- Verifica que están en `public/assets/`
- Comprueba el nombre exacto (case-sensitive)
- Espera 5 minutos en Vercel para CDN

### El formulario RSVP no funciona
- F12 > Network para ver errores
- Revisa los logs en Vercel Dashboard

### "No se pudieron guardar los textos. Revisa BLOB_READ_WRITE_TOKEN"
- Verifica que `BLOB_READ_WRITE_TOKEN` está definido en Vercel
- Confirma que el proyecto está conectado al Blob Store
- Haz redeploy después de guardar variables
- En local, revisa que existe en `.env.local` y reinicia `npm run dev`

---

## 📚 Estructura de Carpetas

```
weddingwebsite/
├── public/
│   └── assets/              # 📸 Imágenes y vídeos
├── src/
│   ├── components/          # 🧩 Componentes React
│   ├── pages/               # 📄 Páginas
│   │   ├── api/             # 🔌 API Backend
│   │   ├── index.tsx        # Página principal
│   │   ├── rsvp.tsx         # Confirmación asistencia
│   │   ├── info.tsx         # Información
│   │   ├── gallery.tsx      # Galería
│   │   ├── coruna.tsx       # Sobre A Coruña
│   │   └── admin.tsx        # Login admin
│   ├── styles/              # 🎨 Estilos CSS
│   ├── utils/               # 🛠️ Funciones utilitarias
│   └── data/                # 📊 JSON (invitados, textos, etc)
├── DEPLOYMENT.md            # 📖 Manual despliegue
├── README.md                # 📖 Documentación
├── package.json             # 📦 Dependencias
├── tsconfig.json           # ⚙️ Config TypeScript
├── next.config.js          # ⚙️ Config Next.js
└── .env.example            # 🔐 Variables ejemplo
```

---

## 🎯 Próximos Pasos

1. ✅ Instala dependencias
2. ✅ Copia imágenes a `public/assets/`
3. ✅ Actualiza lista de invitados
4. ✅ Personaliza textos
5. ✅ Prueba en local (`npm run dev`)
6. ✅ Despliega en Vercel
7. ✅ Comparte URL con invitados
8. ✅ ¡Disfruta la boda! 🎉

---

## 📞 Soporte

- **Docs**: Consulta `README.md` y `DEPLOYMENT.md`
- **Terminal**: Lee los errores completamente
- **DevTools**: F12 en navegador para debugging

---

## ❤️ ¡Que disfrutes tu día especial!

Hecha con amor, Next.js y muchos gradientes azules 🌊💍

---

_Última actualización: Febrero 2026_
_v1.0.0_
