# Manual de Despliegue - Boda Marta & Sergio

## Resumen Ejecutivo

Este documento te guía paso a paso para desplegar la web de la boda en Vercel. La plataforma es gratuita, segura (HTTPS automático) y perfecta para este proyecto.

---

## 📋 Requisitos Previos

- Node.js 18+ instalado ([descargar](https://nodejs.org/))
- Cuenta de GitHub (gratuita en https://github.com)
- Cuenta de Vercel (gratuita en https://vercel.com)
- Editor de código (VS Code recomendado)

---

## 🚀 Pasos de Despliegue

### 1. Preparar el Proyecto Localmente

```bash
# Abre una terminal en la carpeta del proyecto
cd c:\Users\b_r_a\Desktop\Proyectos\weddingwebsite

# Instala las dependencias
npm install

# Prueba en local
npm run dev
```

Abre http://localhost:3000 en tu navegador para verificar que todo funciona.

### 2. Crear Archivo .env.local

Copia `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

Edita `.env.local` si necesitas configurar variables de entorno (email, etc.):

```env
NEXT_PUBLIC_SITE_URL=https://tudominio.vercel.app
```

### 3. Subir a GitHub

```bash
# Inicializa git si aún no lo has hecho
git init

# Agrega todos los archivos
git add .

# Haz un commit
git commit -m "Initial commit: boda website"

# Crea un repositorio en GitHub (opcional pero recomendado)
# Luego:
git remote add origin https://github.com/TU_USUARIO/weddingwebsite.git
git branch -M main
git push -u origin main
```

### 4. Desplegar en Vercel

**Opción A: Desde Vercel Dashboard (Recomendado)**

1. Ve a https://vercel.com/new
2. Haz clic en "Import Git Repository"
3. Selecciona tu repositorio de GitHub (o copia la URL del repo)
4. Vercel detectará automáticamente que es un proyecto Next.js
5. Haz clic en "Deploy"
6. ¡Listo! Tu web estará disponible en una URL como: `weddingwebsite.vercel.app`

**Opción B: Desde Terminal (Usando Vercel CLI)**

```bash
# Instala Vercel CLI globalmente
npm install -g vercel

# Inicia sesión
vercel login

# Despliega
vercel
```

Sigue las instrucciones en pantalla.

### 5. Configurar Dominio Personalizado (Opcional)

Si quieres usar un dominio personalizado en lugar de `weddingwebsite.vercel.app`:

1. En el dashboard de Vercel, ve a "Settings" > "Domains"
2. Agrega tu dominio
3. Sigue las instrucciones para configurar los DNS

---

## 🛠️ Configuración Recomendada Post-Despliegue

### Email (Resend - Recomendado)

Para que los RSVPs envíen emails automáticamente:

1. Ve a https://resend.com
2. Crea una cuenta gratuita
3. Obtén tu API key
4. En Vercel Dashboard:
   - Ve a "Settings" > "Environment Variables"
   - Agrega: `RESEND_API_KEY=tu_clave_aqui`
5. Redeploy el proyecto

### Almacenamiento de Archivos (Vercel Blob)

Para subir fotos a la galería:

1. En Vercel Dashboard de tu proyecto
2. Ve a "Storage" > "Create Database"
3. Selecciona "Blob"
4. La API key se asignará automáticamente
5. Las fotos se guardarán automáticamente

---

## 📱 Gestionar Contenido

### Acceder al Panel Admin

1. Ve a tu web: `https://weddingwebsite.vercel.app/admin`
2. Usuario: `admin`
3. Contraseña: `Hjk908`

### Cambiar Credenciales Admin

En `src/pages/api/auth/login.ts`, modifica:

```typescript
const ADMIN_USER = 'admin';
const ADMIN_PASSWORD = 'Hjk908';
```

Luego redeploy:

```bash
git add .
git commit -m "Update admin credentials"
git push
```

---

## 🖼️ Agregar Imágenes y Vídeos

### Video Hero (Página Principal)

1. Coloca `video1.avi` en `public/assets/`
2. Verifica que el servidor sirva archivos multimedia correctamente

### Fotos Estáticas

Guarda las siguientes imágenes en `public/assets/`:

```
📁 public/
  📁 assets/
    foto01.png          # Foto principal
    foto02.png          # Foto secundaria
    foto03.png          # Tercera foto
    imagen01.png        # Sección "Información"
    imagen02.png        # Ubicación autobús
    imagen03.png        # Hero A Coruña
    video1.avi          # Vídeo principal
```

### Fotos de Galería

Desde el panel admin (`/admin-panel`):
1. Haz clic en pestaña "Galería"
2. Haz clic en "Subir Nueva Foto"
3. Selecciona la foto y agrega etiquetas
4. ¡Hecho!

---

## 📊 Gestionar Invitados

### Archivo de Invitados

El archivo `src/data/guests.json` contiene la lista de invitados. Puedes editarlo directamente:

```json
{
  "id": "1",
  "name": "Juan García López",
  "attendance": "",
  "notes": "",
  "image": "/assets/thank-you-1.png"
}
```

**O** usar el panel admin para gestionar invitados.

### Enviar Emails de RSVP

Con Resend configurado, los emails se enviarán automáticamente cuando alguien confirme su asistencia.

**Importante:** si cambias la lógica de asistencia en `src/pages/api/rsvp/submit.ts` (por ejemplo, el texto que aparece en el email), debes hacer **redeploy** para verlo en producción.

---

## 🔒 Seguridad

### HTTPS

✅ **Automático en Vercel** - Tu web tendrá HTTPS gratis

### Admin Login

- Las credenciales se validan en servidor (`src/pages/api/auth/login.ts`)
- El token se guarda en `sessionStorage` (solo en el navegador)
- Cambiar credenciales requiere nuevo despliegue

### Variables Sensibles

- **Nunca** commits contraseñas al repositorio
- Usa `.env.local` para desarrollo
- Usa "Environment Variables" en Vercel para producción

---

## 🐛 Solucionar Problemas

### El build falla localmente

```bash
# Limpia cache y reinstala
rm -r node_modules package-lock.json
npm install
npm run build
```

### Las imágenes no se cargan en Vercel

1. Asegúrate que están en `public/assets/`
2. Los nombres deben coincidir exactamente (case-sensitive)
3. Espera 5 minutos para que se propague el CDN

### El email no se envía

1. Verifica que `RESEND_API_KEY` esté configurada
2. Verifica los logs en Vercel: Dashboard > "Functions" > "Logs"
3. Prueba en local primero: `npm run dev`

### El email muestra asistencia incorrecta (ej. "Pendiente")

1. Verifica que el backend en producción esté actualizado (nuevo deploy)
2. Revisa que Vercel haya tomado el último commit de `src/pages/api/rsvp/submit.ts`
3. Envía una confirmación de prueba y valida el valor exacto de "Asistencia" recibido

### El formulario RSVP no funciona

1. Verifica que `/api/rsvp/submit` responde (abre en navegador)
2. Abre DevTools (F12) > "Network" para ver las requests
3. Verifica los logs en Vercel

---

## 📈 Monitorización

En Vercel Dashboard puedes ver:

- **Analytics**: Visitantes, países, dispositivos
- **Functions**: Llamadas a API y logs
- **Deployments**: Historial de cambios
- **Performance**: Velocidad y optimizaciones

---

## 📝 Actualizaciones Futuras

Para hacer cambios después del despliegue:

```bash
# Haz cambios en archivos
# Ej: edita src/pages/index.tsx

# Guarda los cambios
git add .
git commit -m "Descripción del cambio"
git push

# Vercel redeploy automáticamente en ~30 segundos
```

---

## 🎯 Próximos Pasos Opcionales

1. **Dominio personalizado**: Compra un dominio y conéctalo a Vercel
2. **Analytics avanzado**: Integra Google Analytics
3. **Backup automático**: Configura backups en GitHub
4. **Certificado SSL avanzado**: Ya está incluido en Vercel
5. **CDN global**: Ya configurado automáticamente en Vercel

---

## 📞 Soporte

Si tienes problemas:

1. **Vercel Docs**: https://vercel.com/docs
2. **Next.js Docs**: https://nextjs.org/docs
3. **Stack Overflow**: Busca errores específicos
4. **GitHub Issues**: Reporta bugs en el repositorio

---

## 🎉 ¡Felicidades!

Tu web de boda está online. Ahora:

1. ✅ Comparte el link con invitados
2. ✅ Gestiona RSVP desde el panel admin
3. ✅ Sube fotos después de la boda
4. ✅ Disfruta de tu día especial 🎂💕

---

**Última actualización**: Febrero 2026
**Versión**: 1.0.0
