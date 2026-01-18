const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
    maxHttpBufferSize: 1e8 // 100MB para frames grandes
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        status: 'INTER Streaming Server Running',
        viewers: io.sockets.sockets.size,
        uptime: process.uptime()
    });
});

// Stats endpoint
app.get('/stats', (req, res) => {
    res.json({
        connectedClients: io.sockets.sockets.size,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage()
    });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    // Notificar a todos los clientes conectados
    io.emit('viewer-count', io.sockets.sockets.size);

    // Recibir frames del puente (PC local)
    socket.on('frame', (data) => {
        // Retransmitir frame a todos los viewers excepto el sender
        socket.broadcast.emit('frame', data);
    });

    // Recibir comandos LED de viewers
    socket.on('led-command', (command) => {
        console.log(`💡 LED command: ${command}`);
        // Reenviar comando al puente (que lo enviará al ESP32)
        io.emit('led-command', command);
    });

    // Manejar desconexión
    socket.on('disconnect', () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
        io.emit('viewer-count', io.sockets.sockets.size);
    });

    // Manejar errores
    socket.on('error', (error) => {
        console.error(`⚠️ Socket error: ${error}`);
    });
});

// Iniciar servidor
server.listen(PORT, () => {
    console.log(`🚀 INTER Streaming Server running on port ${PORT}`);
    console.log(`📡 WebSocket endpoint: ws://localhost:${PORT}`);
});

// Manejo de errores global
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
