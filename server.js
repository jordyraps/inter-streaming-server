```javascript
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const multer = require('multer');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  maxHttpBufferSize: 10e6 // 10MB para frames grandes
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configurar multer para recibir frames del ESP32
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// Estadísticas
let stats = {
  connectedClients: 0,
  framesReceived: 0,
  framesSent: 0,
  lastFrameTime: null,
  esp32Connected: false
};

console.log('🚀 INTER Streaming Server v2.0');
console.log('📡 Soporta ESP32 directo (HTTP POST) y clientes WebSocket');

// ==========================================
// ENDPOINT PARA ESP32 (HTTP POST)
// ==========================================
app.post('/upload', upload.single('frame'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No frame received');
  }

  const frameBuffer = req.file.buffer;
  stats.framesReceived++;
  stats.lastFrameTime = new Date();
  stats.esp32Connected = true;

  // Broadcast frame a todos los clientes conectados
  io.emit('frame', frameBuffer);
  stats.framesSent += io.sockets.sockets.size;

  res.status(200).send('OK');
});

// ==========================================
// WEBSOCKET PARA CLIENTES (Apps Android)
// ==========================================
io.on('connection', (socket) => {
  stats.connectedClients++;
  console.log(`📱 Cliente conectado(Total: ${ stats.connectedClients })`);

  socket.on('disconnect', () => {
    stats.connectedClients--;
    console.log(`📱 Cliente desconectado(Total: ${ stats.connectedClients })`);
  });

  // Comando LED desde cliente
  socket.on('led-command', (command) => {
    console.log(`💡 LED command: ${ command } `);
    // El ESP32 no puede recibir comandos en este modo
    // Los comandos LED no funcionarán sin PC puente
  });
});

// ==========================================
// ENDPOINTS DE INFORMACIÓN
// ==========================================
app.get('/', (req, res) => {
  res.send(`
    < html >
      <head><title>INTER Streaming Server</title></head>
      <body style="font-family: monospace; padding: 20px;">
        <h1>🎥 INTER Streaming Server v2.0</h1>
        <h2>Status: <span style="color: green;">LIVE</span></h2>
        <h3>📊 Estadísticas:</h3>
        <ul>
          <li>Clientes conectados: ${stats.connectedClients}</li>
          <li>Frames recibidos: ${stats.framesReceived}</li>
          <li>Frames enviados: ${stats.framesSent}</li>
          <li>ESP32 conectado: ${stats.esp32Connected ? '✅ Sí' : '❌ No'}</li>
          <li>Último frame: ${stats.lastFrameTime ? stats.lastFrameTime.toLocaleString() : 'Nunca'}</li>
        </ul>
        <h3>🔧 Endpoints:</h3>
        <ul>
          <li><code>POST /upload</code> - ESP32 sube frames aquí</li>
          <li><code>GET /stats</code> - Estadísticas JSON</li>
          <li><code>WebSocket /</code> - Clientes reciben frames</li>
        </ul>
      </body>
    </html >
    `);
});

app.get('/stats', (req, res) => {
  res.json(stats);
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================
server.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${ PORT } `);
  console.log(`📡 WebSocket endpoint: ws://localhost:${PORT}`);
console.log(`📤 ESP32 POST endpoint: https://[tu-url]/upload`);
console.log('');
console.log('='.repeat(50));
console.log(`Available at your primary URL`);
console.log('='.repeat(50));
});

// Manejo de errores global
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
```
