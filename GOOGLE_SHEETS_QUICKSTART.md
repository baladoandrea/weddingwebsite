# ⚡ Guía Rápida - Conectar con Google Sheets (5 minutos)

## 🎯 Pasos Esenciales

### 1️⃣ Crea tu Google Sheet
- Nueva hoja en [sheets.google.com](https://sheets.google.com)
- Crea hoja llamada: `Invitados`
- Primera fila (encabezados): `ID | Nombre | Asistencia | Notas | Imagen`
- Llena desde fila 2 con tus invitados

### 2️⃣ Obtén el ID de tu Sheet
```
https://docs.google.com/spreadsheets/d/[COPIA_ESTE_ID]/edit
```

### 3️⃣ Configura Google Cloud (gratis)
1. [console.cloud.google.com](https://console.cloud.google.com)
2. Nuevo proyecto → "Wedding Website"
3. APIs y servicios → Biblioteca → Busca "Google Sheets API" → Habilitar
4. Credenciales → Crear credenciales → Clave de API → **Copiar la clave**
5. (Opcional) Restringir clave solo a "Google Sheets API"

### 4️⃣ Haz tu Sheet pública (solo lectura)
- Compartir → "Cualquier persona con el enlace" → **Lector**

### 5️⃣ Configura variables de entorno
Crea `.env.local` en la raíz del proyecto:
```env
GOOGLE_SHEETS_ID=tu_sheet_id_aqui
GOOGLE_SHEETS_API_KEY=tu_api_key_aqui
```

### 6️⃣ Prueba
```bash
npm run dev
```
Abre: `http://localhost:3000/api/guests`

---

## 📦 Lo Que Ya Está Listo

✅ API endpoint actualizado en `/src/pages/api/guests.ts`  
✅ Lectura automática desde Google Sheets  
✅ Actualización de asistencia en tiempo real  
✅ Fallback a JSON local si no hay conexión  

---

## 🚀 Deploy en Vercel

1. Vercel Dashboard → Tu proyecto → Settings → Environment Variables
2. Agrega las 2 variables:
   - `GOOGLE_SHEETS_ID`
   - `GOOGLE_SHEETS_API_KEY`
3. Save y re-deploya

---

📖 Guía completa: [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md)
