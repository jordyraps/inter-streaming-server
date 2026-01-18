# INTER Streaming Server

Servidor relay para streaming ESP32-CAM a múltiples dispositivos remotos.

## 📋 Deployment en Render.com

### Paso 1: Preparar repositorio Git

```bash
cd C:\Users\USER\Documents\APPS\INTER_SERVER
git init
git add .
git commit -m "Initial commit"
```

### Paso 2: Subir a GitHub

1. Crea un repositorio en GitHub (público o privado)
2. Conecta y sube:
```bash
git remote add origin https://github.com/TU-USUARIO/inter-server.git
git push -u origin main
```

### Paso 3: Deploy en Render.com

1. Ve a https://dashboard.render.com
2. Click en **"New +"** → **"Web Service"**
3. Conecta tu repositorio GitHub
4. Configuración:
   - **Name:** `inter-streaming`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** `Free`
5. Click **"Create Web Service"**
6. Espera 2-3 minutos a que despliegue

### Paso 4: Obtener URL

Cuando termine el deploy, verás tu URL:
```
https://inter-streaming.onrender.com
```

Copia esta URL para usarla en el puente y la app Android.

---

## 🖥️ Uso del Puente (Tu PC)

### Instalación

```bash
pip install python-socketio
```

### Configuración

Edita `udp_bridge.py` línea 9:
```python
SERVER_URL = "https://inter-streaming.onrender.com"  # Tu URL de Render
```

### Ejecución

```bash
python udp_bridge.py
```

Debes ver:
```
✅ Conectado al servidor relay
✅ Puente iniciado. Esperando frames del ESP32...
📊 Enviando a servidor: 30.0 FPS
```

---

## 📱 Configuración App Android

Edita `MainActivity.kt` línea 18:
```kotlin
private val SERVER_URL = "https://inter-streaming.onrender.com"
```

Recompila y distribuye la app a tus usuarios.

---

## 🔧 Arquitectura

```
[ESP32] --UDP--> [Tu PC: udp_bridge.py] --WebSocket--> [Render.com] --WebSocket--> [Apps Android]
```

---

## 📊 Monitoreo

- **Status:** `https://inter-streaming.onrender.com/`
- **Stats:** `https://inter-streaming.onrender.com/stats`

---

## ⚠️ Importante

- **Tu PC debe estar encendida** ejecutando `udp_bridge.py`
- **Render.com gratis:** 750 horas/mes (suficiente para 24/7)
- **Latencia esperada:** 500ms - 1 segundo
- **Usuarios simultáneos:** Hasta 5 sin problemas
