# ✅ Checklist: Conectar Excel/Google Sheet con RSVP

## ¿Qué necesitas verificar?

### 1️⃣ Tu Google Sheet debe tener esta estructura exacta:

**Nombre de la hoja:** `Invitados` (exactamente así, con mayúscula)

**Columnas (fila 1):**
```
A1: ID
B1: Nombre
C1: Asistencia
D1: Notas
E1: Imagen
```

**Datos (desde fila 2):**
```
| ID | Nombre              | Asistencia | Notas | Imagen                    |
|----|---------------------|------------|-------|---------------------------|
| 1  | Juan García López   |            |       | /assets/thank-you-1.png   |
| 2  | María Rodríguez     |            |       | /assets/thank-you-2.png   |
```

### 2️⃣ La hoja debe ser pública (solo lectura)
1. Abre tu Google Sheet
2. Click en "Compartir" (arriba derecha)
3. "Acceso general" → "Cualquier persona con el enlace" → **Lector**

### 3️⃣ Verificar las variables de entorno

Tu `.env.local` debe tener (ya lo tienes ✅):
```env
GOOGLE_SHEETS_ID=13mDj9xObG1RIhRe_eDeKrt6jsMMO9J63kVaLlETo8dU
GOOGLE_SHEETS_API_KEY=AIzaSyCkKba49X16ShuZ63GFkguJ_WIzCFi94Cg
```

### 4️⃣ Reiniciar el servidor

**IMPORTANTE:** Debes reiniciar el servidor después de cambiar `.env.local`

```bash
# Detener el servidor (Ctrl+C)
# Luego reiniciar:
npm run dev
```

### 5️⃣ Probar la conexión

#### Opción A: En el navegador
1. Abre: http://localhost:3000/api/guests
2. Deberías ver un JSON con tus invitados del Google Sheet
3. Si ves los datos, **está funcionando** ✅

#### Opción B: Script de verificación
```bash
node verify-google-sheets.js
```

### 6️⃣ Probar el buscador RSVP
1. Ve a tu página de RSVP: http://localhost:3000/rsvp
2. Escribe un nombre de tu Google Sheet
3. Debe aparecer en las sugerencias

---

## 🔧 Troubleshooting

### "No veo mis invitados en el buscador"
- ✅ Reiniciaste el servidor después de configurar `.env.local`?
- ✅ La hoja se llama exactamente `Invitados`?
- ✅ Los datos empiezan en la fila 2?
- ✅ La hoja es pública (Lector)?

### "Error 403 o 'caller does not have permission'"
- Haz la hoja pública en Google Sheets
- Settings → Sharing → "Anyone with the link" → "Viewer"

### "Error 404 o 'sheet not found'"
- Verifica que la hoja se llame exactamente `Invitados`
- Case-sensitive: debe tener la I mayúscula

### "Veo los datos de guests.json en vez del Sheet"
- Verifica que `.env.local` tenga las variables correctas
- Reinicia el servidor con `npm run dev`
- Abre la consola del servidor y busca errores

---

## 📝 Comando Rápido de Verificación

```bash
# 1. Verificar variables de entorno
cat .env.local | grep GOOGLE_SHEETS

# 2. Verificar que no haya errores en el código
npm run build

# 3. Reiniciar servidor
npm run dev

# 4. Probar API
# Abre en el navegador: http://localhost:3000/api/guests
```

---

## ✨ Una vez que funcione

Cuando confirmes que `/api/guests` muestra tus datos del Sheet:

1. **El buscador de RSVP** usará automáticamente esos datos
2. **Cuando alguien confirme asistencia**, se actualizará en tu Google Sheet
3. **No necesitas tocar guests.json** nunca más (es solo fallback)

---

¿Sigue sin funcionar? Verifica en la consola del servidor (`npm run dev`) si hay algún error cuando cargas la página de RSVP.
