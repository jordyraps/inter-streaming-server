# INTER Streaming Server - Deploy Manual

## ⚠️ El repositorio GitHub no se pudo acceder

**Solución alternativa: Deploy manual con archivos locales**

### Opción 1: Usar Render CLI (Recomendado)

1. **Instala Render CLI:**
```bash
npm install -g @render-cli/cli
```

2. **Login en Render:**
```bash
render login
```

3. **Deploy desde carpeta local:**
```bash
cd C:\Users\USER\Documents\APPS\INTER_SERVER
render deploy
```

---

### Opción 2: Crear repositorio público en GitHub

El problema fue que el repositorio es **privado** o no se creó correctamente.

1. **Ve a:** https://github.com/joxdyzz/inter-streaming-server
2. **Verifica que exista** y sea **público**
3. Si no existe, créalo de nuevo como **público**
4. Ejecuta de nuevo:
```bash
cd C:\Users\USER\Documents\APPS\INTER_SERVER
git push -u origin main
```

---

### Opción 3: Subir archivos manualmente a Render

Render no soporta upload directo de archivos. **Debes usar GitHub obligatoriamente**.

---

## 🎯 Solución DEFINITIVA (Más fácil)

**Usa Railway.app en lugar de Render** - soporta deploy desde CLI sin GitHub:

1. Ve a https://railway.app
2. Regístrate (gratis)
3. Instala Railway CLI:
```bash
npm install -g @railway/cli
```

4. Login:
```bash
railway login
```

5. Deploy:
```bash
cd C:\Users\USER\Documents\APPS\INTER_SERVER
railway init
railway up
```

6. Obtienes tu URL automáticamente

---

**¿Qué prefieres?**
- Arreglar GitHub y usar Render
- Usar Railway.app (más fácil, sin GitHub)
