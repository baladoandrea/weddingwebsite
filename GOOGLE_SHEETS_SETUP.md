# 📊 Configuración de Google Sheets para Invitados

Esta guía te explica cómo conectar tu listado de invitados con Google Sheets para que las confirmaciones de asistencia se guarden automáticamente.

## 📋 Paso 1: Crear tu Google Sheet

1. Ve a [Google Sheets](https://sheets.google.com) e inicia sesión
2. Crea una nueva hoja de cálculo
3. Nómbrala como quieras (ej: "Invitados Boda")
4. Crea una hoja llamada **exactamente** `Invitados`
5. En la **fila 1** (encabezados), escribe:
   - **A1:** `ID`
   - **B1:** `Nombre`
   - **C1:** `Asistencia`
   - **D1:** `Notas`
   - **E1:** `Imagen`

6. A partir de la **fila 2**, llena con tus invitados:
   ```
   | ID | Nombre              | Asistencia | Notas | Imagen                    |
   |----|---------------------|------------|-------|---------------------------|
   | 1  | Juan García López   |            |       | /assets/thank-you-1.png   |
   | 2  | María Rodríguez     |            |       | /assets/thank-you-2.png   |
   ```

### Ejemplo de estructura:
```
A           B                       C           D       E
ID          Nombre                  Asistencia  Notas   Imagen
1           Juan García López                           /assets/thank-you-1.png
2           María Rodríguez                             /assets/thank-you-2.png
3           Carlos Fernández                            /assets/thank-you-3.png
```

---

## 🔑 Paso 2: Obtener el ID de tu Google Sheet

1. Con tu hoja abierta, mira la URL en el navegador:
   ```
   https://docs.google.com/spreadsheets/d/1a2B3c4D5e6F7g8H9i0J/edit
                                          ^^^^^^^^^^^^^^^^^^^^
                                          Este es tu SHEET_ID
   ```
2. Copia ese ID (la parte entre `/d/` y `/edit`)
3. Guárdalo para el **Paso 4**

---

## 🌐 Paso 3: Configurar Google Cloud API

### 3.1 Crear Proyecto en Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Haz clic en **"Seleccionar proyecto"** → **"Nuevo proyecto"**
3. Dale un nombre (ej: "Wedding Website")
4. Haz clic en **"Crear"**

### 3.2 Habilitar Google Sheets API

1. En el menú lateral, ve a **"APIs y servicios"** → **"Biblioteca"**
2. Busca `Google Sheets API`
3. Haz clic en el resultado
4. Presiona **"Habilitar"**

### 3.3 Crear API Key

1. Ve a **"APIs y servicios"** → **"Credenciales"**
2. Haz clic en **"Crear credenciales"** → **"Clave de API"**
3. Se creará una clave automáticamente
4. **Copia esa clave** (ej: `AIzaSyB1c2D3e4F5g6H7i8J9k0L`)
5. (Opcional pero recomendado) Haz clic en **"Editar clave de API"**:
   - En **"Restricciones de API"**, selecciona **"Restringir clave"**
   - Marca solo **"Google Sheets API"**
   - Guarda

### 3.4 Hacer pública tu Google Sheet (Solo Lectura)

1. Abre tu Google Sheet
2. Haz clic en **"Compartir"** (arriba a la derecha)
3. En **"Acceso general"**, cambia a:
   - **"Cualquier persona con el enlace"**
   - **"Lector"** (solo lectura)
4. Haz clic en **"Listo"**

> ⚠️ **Importante:** Solo configura como "Lector". Nunca des permisos de "Editor" públicamente.

---

## 🔧 Paso 4: Configurar Variables de Entorno

1. En la raíz de tu proyecto, crea un archivo `.env.local`:
   ```bash
   # En la terminal:
   cp .env.example .env.local
   ```

2. Abre `.env.local` y completa:
   ```env
   # Google Sheets
   GOOGLE_SHEETS_ID=1a2B3c4D5e6F7g8H9i0J
   GOOGLE_SHEETS_API_KEY=AIzaSyB1c2D3e4F5g6H7i8J9k0L
   ```

3. Reemplaza con:
   - `GOOGLE_SHEETS_ID`: El ID que copiaste en el **Paso 2**
   - `GOOGLE_SHEETS_API_KEY`: La API Key del **Paso 3.3**

---

## 🚀 Paso 5: Probar la Conexión

1. Reinicia tu servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Abre tu navegador en `http://localhost:3000/api/guests`

3. Deberías ver un JSON con tus invitados de Google Sheets

4. Si ves tus datos, **¡está funcionando!** 🎉

---

## ✅ Verificar que Todo Funciona

### Test 1: Leer invitados
```bash
# En tu navegador:
http://localhost:3000/api/guests
```
Deberías ver tu lista de invitados.

### Test 2: Buscar un invitado
1. Ve a tu página de RSVP
2. Busca un nombre de tu lista
3. Debería aparecer en los resultados

### Test 3: Actualizar asistencia
1. Confirma asistencia de un invitado
2. Ve a tu Google Sheet
3. En unos segundos debería aparecer la confirmación en la columna "Asistencia"

---

## 🔒 Seguridad en Producción (Vercel)

### En Vercel Dashboard:

1. Ve a tu proyecto → **"Settings"** → **"Environment Variables"**
2. Agrega las dos variables:
   ```
   GOOGLE_SHEETS_ID
   GOOGLE_SHEETS_API_KEY
   ```
3. Marca que apliquen para **"Production"**, **"Preview"** y **"Development"**
4. Haz clic en **"Save"**
5. Re-deploya tu proyecto:
   ```bash
   git push
   ```

---

## 🛠️ Troubleshooting

### Error: "The caller does not have permission"
- Ve al **Paso 3.4** y asegúrate que tu Sheet sea pública (Lector)
- Verifica que la API Key tenga permiso para Google Sheets API

### Error: "API key not valid"
- Copia nuevamente la API Key del Google Cloud Console
- Verifica que no tenga espacios al principio/final
- Asegúrate que está en el archivo `.env.local` correcto

### No se actualizan los cambios
- La API de Google Sheets puede tener 1-2 segundos de delay
- Refresca tu navegador después de confirmar
- Revisa la consola del servidor (`npm run dev`) para ver errores

### Los invitados no aparecen
- Verifica que la hoja se llame **exactamente** `Invitados`
- Confirma que la fila 1 tenga los encabezados correctos
- Asegúrate que los datos empiecen en la fila 2

---

## 📚 Recursos Adicionales

- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Google Cloud Console](https://console.cloud.google.com)
- [Gestión de API Keys](https://cloud.google.com/docs/authentication/api-keys)

---

## ✨ Características Implementadas

✅ **Lectura automática** de invitados desde Google Sheets  
✅ **Actualización en tiempo real** cuando alguien confirma  
✅ **Fallback** a datos locales si no hay conexión  
✅ **Cache** para mejorar rendimiento  
✅ **Búsqueda inteligente** (sin acentos, case-insensitive)  

---

## 📝 Notas

- **Sin Google Sheets configurado:** La app usa `src/data/guests.json` como fallback
- **Con Google Sheets:** Lee y actualiza directamente en tu hoja
- **Actualización:** Solo escritura de columnas Asistencia y Notas (no crea/elimina invitados)
- **Límites:** Google Sheets API tiene límite de 100 requests/100 segundos por usuario (suficiente para una boda)

---

¿Problemas? Abre un issue o revisa los logs del servidor con `npm run dev`.
