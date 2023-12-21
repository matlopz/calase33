const { Server } = require('socket.io');
const User = require('./models/user');
const Message = require('./models/message');
const { authToken } = require('./utils/jwt');


const initializeIO = (httpServer) => {
  const io = new Server(httpServer);
  io.use((socket, next) => {

    authToken(socket.request, {}, (err) => {
      if (err) {

        return next(new Error('Authentication error'));
      }
      next();
    });
  });

  io.on('connection', async (socket) => {


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
