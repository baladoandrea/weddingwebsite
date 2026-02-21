# 🔒 Guía de Seguridad - Variables de Entorno

## ✅ Lo que ya está protegido

Tu configuración actual es segura:

- ✅ `.env.local` está en `.gitignore` (NO se sube a GitHub)
- ✅ `.env.example` solo tiene placeholders (seguro para GitHub)
- ✅ Las credenciales reales están en `.env.local`

---

## 📁 Estructura de Archivos de Entorno

### `.env.local` (🔴 NUNCA subir a GitHub)
```env
# Tus credenciales REALES
GOOGLE_SHEETS_ID=13mDj9xObG1RIhRe_eDeKrt6jsMMO9J63kVaLlETo8dU
GOOGLE_SHEETS_API_KEY=AIzaSyCkKba49X16ShuZ63GFkguJ_WIzCFi94Cg
RESEND_API_KEY=re_9ycAzX1G_cpeGcrbHdmcLArgLBte4Rrjb
```
- **Uso:** Desarrollo local
- **Git:** Ignorado automáticamente
- **Contiene:** Valores reales

### `.env.example` (✅ Seguro para GitHub)
```env
# Solo ejemplos/placeholders
GOOGLE_SHEETS_ID=your_google_sheet_id_here
GOOGLE_SHEETS_API_KEY=your_google_api_key_here
RESEND_API_KEY=re_your_resend_api_key_here
```
- **Uso:** Plantilla para otros desarrolladores
- **Git:** Se sube al repositorio
- **Contiene:** Solo placeholders

---

## 🚀 Configurar Variables en Vercel

### Método 1: Dashboard de Vercel (Recomendado)

1. Ve a tu proyecto en [vercel.com](https://vercel.com)
2. Click en **Settings** → **Environment Variables**
3. Agrega cada variable una por una:

   ```
   GOOGLE_SHEETS_ID
   valor: 13mDj9xObG1RIhRe_eDeKrt6jsMMO9J63kVaLlETo8dU
   Environments: ☑ Production ☑ Preview ☑ Development
   ```

   ```
   GOOGLE_SHEETS_API_KEY
   valor: AIzaSyCkKba49X16ShuZ63GFkguJ_WIzCFi94Cg
   Environments: ☑ Production ☑ Preview ☑ Development
   ```

   ```
   RESEND_API_KEY
   valor: re_9ycAzX1G_cpeGcrbHdmcLArgLBte4Rrjb
   Environments: ☑ Production ☑ Preview ☑ Development
   ```

   ```
   ADMIN_USER
   valor: admin
   Environments: ☑ Production ☑ Preview
   ```

   ```
   ADMIN_PASSWORD
   valor: Hjk908
   Environments: ☑ Production ☑ Preview
   ```

4. Click **Save** en cada una
5. Re-deploya tu proyecto (Vercel lo hará automáticamente)

### Método 2: CLI de Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Vincular proyecto
vercel link

# Agregar variables (una por una)
vercel env add GOOGLE_SHEETS_ID production
# (pegar el valor cuando lo pida)

vercel env add GOOGLE_SHEETS_API_KEY production
vercel env add RESEND_API_KEY production
vercel env add ADMIN_USER production
vercel env add ADMIN_PASSWORD production

# Desplegar
vercel --prod
```

---

## ⚠️ NUNCA Hagas Esto

### ❌ NO subas `.env.local` a GitHub
```bash
# Esto es MALO:
git add .env.local
git commit -m "added credentials"  # ¡NUNCA!
```

### ❌ NO pongas credenciales reales en `.env.example`
```env
# MALO - .env.example
GOOGLE_SHEETS_API_KEY=AIzaSyCkKba49X16ShuZ63GFkguJ_WIzCFi94Cg  # ❌

# BIEN - .env.example
GOOGLE_SHEETS_API_KEY=your_google_api_key_here  # ✅
```

### ❌ NO hagas hardcode de credenciales en el código
```typescript
// MALO ❌
const apiKey = 'AIzaSyCkKba49X16ShuZ63GFkguJ_WIzCFi94Cg';

// BIEN ✅
const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
```

---

## 🔍 Verificar que `.env.local` NO se suba

```bash
# Verificar que está en .gitignore
cat .gitignore | grep "env.local"
# Debe mostrar: .env.local

# Ver qué archivos Git va a subir
git status
# NO debe aparecer .env.local

# Si aparece .env.local, hacer:
git rm --cached .env.local
git commit -m "Remove .env.local from git"
```

---

## 🧪 Probar que funciona

### Local (con `.env.local`)
```bash
npm run dev
# Abre http://localhost:3000/api/guests
# Deberías ver tus invitados de Google Sheets
```

### En Vercel (con Environment Variables)
1. Despliega: `git push`
2. Abre: `https://tu-dominio.vercel.app/api/guests`
3. Deberías ver los mismos datos

---

## 📝 Checklist de Seguridad

Antes de hacer `git push`, verifica:

- [ ] `.env.local` está en `.gitignore`
- [ ] `.env.example` NO tiene credenciales reales
- [ ] `git status` NO muestra `.env.local`
- [ ] Variables configuradas en Vercel Dashboard
- [ ] No hay API keys hardcodeadas en el código

---

## 🆘 Si ya subiste credenciales a GitHub

Si accidentalmente subiste `.env.local` o pusiste credenciales en `.env.example`:

### 1. Rotar TODAS las credenciales inmediatamente:

**Google Sheets API:**
- Ve a [Google Cloud Console](https://console.cloud.google.com)
- APIs y servicios → Credenciales
- Elimina la API Key comprometida
- Crea una nueva
- Actualiza `.env.local` y Vercel

**Resend:**
- Ve a [Resend Dashboard](https://resend.com/api-keys)
- Elimina la API Key comprometida
- Crea una nueva
- Actualiza `.env.local` y Vercel

### 2. Eliminar del historial de Git:

```bash
# ADVERTENCIA: Esto reescribe el historial de Git
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env.local" \
  --prune-empty --tag-name-filter cat -- --all

# Forzar push (úsalo con cuidado)
git push origin --force --all
```

### 3. Alternativa más segura (si el repo es público):
- Hacer el repo privado temporalmente
- Crear un nuevo repo con código limpio
- Migrar colaboradores

---

## 🎓 Recursos

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [GitHub: Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)

---

**Recuerda:** `.env.local` es para desarrollo, Vercel Environment Variables es para producción. Nunca los dos deben contener las mismas credenciales expuestas en GitHub.
