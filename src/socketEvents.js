module.exports = (socket, io) => {
  socket.on('sendMessage', (message) => {
    try {
      io.emit('receiveMessage', message);
    } catch (err) {
      console.error('Error al obtener los mensajes:', err);
    }
  });
};
