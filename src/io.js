const mongoose = require('mongoose');
const { Server } = require('socket.io');
const cartsService = require('./services/cartsService');
const Products = require('./models/products.models');
const User = require('./models/user');
const Message = require('./models/message');
const { authToken } = require('./utils/jwt');


const initializeIO = (httpServer) => {
  const io = new Server(httpServer);
  io.use((socket, next) => {
    // Middleware para autenticar el socket usando el token
    authToken(socket.request, {}, (err) => {
      if (err) {
        // Manejar el error de autenticación
        return next(new Error('Authentication error'));
      }
      next();
    });
  });
  
  io.on('connection', async (socket) => {
    console.log(`Usuario conectado: ${socket.id}`);
    
    socket.on('message', async data => {
      const user = await User.findOne({ username: data.user });
      const message = new Message({ user: user._id, message: data.message });
      await message.save();

      io.emit('messageLogs', await Message.find().populate('user'));
    });

    
  });

  return io;
};

module.exports = initializeIO;
