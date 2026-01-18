# Configuración del Sistema INTER - Streaming Remoto

## 🎉 Servidor Desplegado Exitosamente

**URL del servidor:** https://inter-streaming-server-1.onrender.com

---

## 📋 Próximos Pasos

### 1️⃣ Probar el Puente (Tu PC)

**Instalar dependencia:**
```bash
pip install python-socketio
```

**Ejecutar puente:**
```bash
cd C:\Users\USER\Documents\APPS\INTER_SERVER
python udp_bridge.py
```

**Deberías ver:**
```
✅ Conectado al servidor relay
✅ Puente iniciado. Esperando frames del ESP32...
📊 Enviando a servidor: 30.0 FPS
```

---

### 2️⃣ Configurar App Android

**Modificar código:**
- Archivo: `MainActivity.kt`
- Línea 18: Cambiar IP local por URL del servidor

**Recompilar app:**
- Android Studio → Build → Rebuild Project
- Run → Instalar en celulares

---

### 3️⃣ Uso del Sistema

**Para transmitir:**
1. Enciende el ESP32-CAM
2. Ejecuta `python udp_bridge.py` en tu PC
3. Los usuarios abren la app en sus celulares
4. ¡Listo! Streaming desde cualquier lugar del mundo

**Requisitos:**
- Tu PC debe estar encendida (actúa como puente)
- ESP32 conectado a WiFi
- Usuarios con app instalada

---

## 🔧 Arquitectura Final

```
[ESP32-CAM] --UDP--> [Tu PC: udp_bridge.py] --WebSocket--> [Render.com] --WebSocket--> [Apps Android]
   (Casa)              (Puente local)                        (Relay gratis)              (Cualquier lugar)
```

---

## 📊 Monitoreo

- **Status:** https://inter-streaming-server-1.onrender.com/
- **Stats:** https://inter-streaming-server-1.onrender.com/stats

---

## ⚠️ Importante

- **Plan gratis Render:** 750 horas/mes (suficiente para 24/7)
- **Latencia esperada:** 500ms - 1 segundo
- **Usuarios simultáneos:** Hasta 5 sin problemas
- **Tu PC debe estar encendida** ejecutando el puente
