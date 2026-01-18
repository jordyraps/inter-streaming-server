import socket
import struct
import socketio
import time
import sys

# Configuración
ESP32_UDP_PORT = 12345
SERVER_URL = "https://tu-app.onrender.com"  # CAMBIAR después del deploy

# Crear cliente Socket.IO
sio = socketio.Client()

# Variables globales
frame_buffer = bytearray()
expected_size = 0
receiving_frame = False
frame_count = 0
last_fps_time = time.time()

@sio.event
def connect():
    print("✅ Conectado al servidor relay")

@sio.event
def disconnect():
    print("❌ Desconectado del servidor relay")

@sio.on('led-command')
def on_led_command(data):
    """Recibir comandos LED del servidor y reenviar al ESP32"""
    print(f"💡 LED command recibido: {data}")
    # Aquí podrías reenviar el comando al ESP32 si es necesario
    # (el ESP32 ya recibe comandos directamente de la app)

def process_udp_packet(data, length):
    """Procesar paquetes UDP del ESP32"""
    global frame_buffer, expected_size, receiving_frame, frame_count, last_fps_time
    
    if length == 4:
        # Header packet con tamaño total
        expected_size = struct.unpack('I', data[:4])[0]
        frame_buffer = bytearray()
        receiving_frame = True
        return
    
    if receiving_frame and length > 2:
        # Data packet
        packet_num = struct.unpack('H', data[:2])[0]
        frame_buffer.extend(data[2:length])
        
        # Si tenemos el frame completo
        if len(frame_buffer) >= expected_size:
            # Enviar frame al servidor
            try:
                sio.emit('frame', bytes(frame_buffer[:expected_size]))
                
                # Calcular FPS
                frame_count += 1
                current_time = time.time()
                elapsed = current_time - last_fps_time
                
                if elapsed >= 1.0:
                    fps = frame_count / elapsed
                    print(f"📊 Enviando a servidor: {fps:.1f} FPS")
                    frame_count = 0
                    last_fps_time = current_time
                    
            except Exception as e:
                print(f"❌ Error enviando frame: {e}")
            
            receiving_frame = False
            frame_buffer = bytearray()

def main():
    print("🚀 INTER UDP to WebSocket Bridge")
    print(f"📡 Escuchando UDP en puerto {ESP32_UDP_PORT}")
    print(f"🌐 Conectando a servidor: {SERVER_URL}")
    
    # Conectar al servidor Socket.IO
    try:
        sio.connect(SERVER_URL)
    except Exception as e:
        print(f"❌ Error conectando al servidor: {e}")
        print("Verifica que el servidor esté corriendo y la URL sea correcta")
        sys.exit(1)
    
    # Crear socket UDP
    udp_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    udp_socket.bind(("0.0.0.0", ESP32_UDP_PORT))
    udp_socket.settimeout(1.0)
    
    print("✅ Puente iniciado. Esperando frames del ESP32...")
    
    try:
        while True:
            try:
                data, addr = udp_socket.recvfrom(1500)
                process_udp_packet(data, len(data))
            except socket.timeout:
                continue
            except KeyboardInterrupt:
                break
            except Exception as e:
                print(f"⚠️ Error: {e}")
                continue
                
    finally:
        print("\n🛑 Cerrando puente...")
        udp_socket.close()
        sio.disconnect()

if __name__ == "__main__":
    main()
