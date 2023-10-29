// socketEvents.js
module.exports = (socket, io) => {
    socket.on('sendMessage', (message) => {
      try {
        // Escucha el evento de envío de mensajes
  
        // Emitir el mensaje a todos los usuarios conectados
        io.emit('receiveMessage', message);
      } catch (err) {
        console.error('Error al obtener los mensajes:', err);
      }
    });
  };
  