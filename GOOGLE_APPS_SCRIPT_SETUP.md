# 📝 Configurar Google Apps Script para Actualizar Google Sheets

## ¿Por qué necesito esto?

Con solo **API Key**, Google Sheets API solo permite **leer datos** (por eso ves los nombres en el buscador ✅).

Para **actualizar datos** (guardar confirmaciones de asistencia), necesitas usar **Google Apps Script**.

---

## 📋 Pasos (5 minutos)

### 1️⃣ Abre tu Google Sheet

Ve a tu hoja de invitados en [sheets.google.com](https://sheets.google.com)

### 2️⃣ Abre el Editor de Apps Script

- En el menú superior: **Extensiones** → **Apps Script**
- Se abrirá una nueva pestaña con el editor

### 3️⃣ Pega el Código

1. **Borra todo** el código que aparece por defecto
2. Abre el archivo `google-apps-script.js` en tu proyecto
3. **Copia todo el código**
4. **Pégalo** en el editor de Apps Script
5. Click en **💾 Guardar** (o Ctrl+S)
6. Dale un nombre al proyecto (ej: "Wedding RSVP Updater")

### 4️⃣ Implementar como Web App

1. Click en **Implementar** (arriba a la derecha) → **Nueva implementación**

2. En "Seleccionar tipo", click en el ⚙️ y elige **Aplicación web**

3. Configura así:
   - **Descripción:** "RSVP Updater"
   - **Ejecutar como:** **Yo** (tu cuenta)
   - **Acceso:** **Cualquier persona**
   
4. Click en **Implementar**

5. **Autorizar acceso:**
   - Click en **Autorizar acceso**
   - Selecciona tu cuenta de Google
   - Click en **Avanzado** → **Ir a [nombre del proyecto] (no seguro)**
   - Click en **Permitir**

6. **Copia la URL de Web App:**
   - Verás algo como: `https://script.google.com/macros/s/AKfycby.../exec`
   - **Cópiala completa** (la necesitarás en el siguiente paso)

### 5️⃣ Agregar la URL a Vercel

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Tu proyecto → **Settings** → **Environment Variables**
3. Agrega esta nueva variable:

   ```
   Key: GOOGLE_APPS_SCRIPT_URL
   Value: https://script.google.com/macros/s/AKfycby.../exec
   ```
   - Pega la URL que copiaste en el paso 4
   - Marca: ☑️ Production  ☑️ Preview  ☑️ Development
   - Click **Save**

### 6️⃣ Re-deployar

```bash
git add .
git commit -m "feat: enable Google Sheets updates via Apps Script"
git push
```

Espera 2-3 minutos para que Vercel haga el deploy.

### 7️⃣ Probar

1. Ve a tu página de RSVP
2. Busca un invitado
3. Confirma asistencia
4. **Revisa tu Google Sheet** → la columna "Asistencia" debe actualizarse ✅

---

## 🧪 Verificar que el Script funciona

**Antes de hacer deploy**, prueba que el Apps Script funciona:

1. Abre la URL del Web App en tu navegador
2. Deberías ver algo como:
   ```json
   {
     "success": true,
     "message": "Google Apps Script funcionando correctamente",
     "sheet": "Nombre de tu hoja"
   }
   ```

Si ves eso, **está funcionando** ✅

---

## 🔧 Troubleshooting

### "Error 401 o 403"
- Verifica que en la implementación elegiste **"Acceso: Cualquier persona"**
- Re-implementa el script si es necesario

### "Hoja 'Invitados' no encontrada"
- Verifica que tu hoja se llame exactamente **Invitados** (con I mayúscula)

### No se actualiza el Sheet
- Abre la consola de Apps Script: **Ejecutar** → **Ver registros**
- Busca errores en el log
- Asegúrate de que el ID del invitado existe en la columna A

### "Script no autorizado"
- Ve a Apps Script → **Implementar** → **Administrar implementaciones**
- Click en el lápiz ✏️ → **Nueva versión** → Implementar
- Vuelve a autorizar

---

## 📊 Estructura del Sheet (Recordatorio)

Tu Google Sheet debe tener:

```
| A: ID | B: Nombre           | C: Asistencia | D: Notas | E: Imagen              |
|-------|---------------------|---------------|----------|------------------------|
| 1     | Juan García López   | yes           | ...      | /assets/thank-you.png  |
| 2     | María Rodríguez     | no            | ...      | /assets/thank-you.png  |
```

El script actualiza las columnas **C (Asistencia)** y **D (Notas)** automáticamente.

---

## ✨ Lo que tendrás al final

✅ **Lectura:** RSVP busca invitados en Google Sheet (ya funciona)  
✅ **Escritura:** Confirmaciones se guardan automáticamente en Google Sheet  
✅ **Emails:** Recibes notificación en tu correo  
✅ **Tiempo real:** Los cambios se ven inmediatamente en el Sheet  

---

¿Problemas? Verifica:
1. La URL del Apps Script está correctamente copiada en Vercel
2. El script está implementado como "Aplicación web"
3. El acceso es "Cualquier persona"
4. La hoja se llama exactamente "Invitados"
