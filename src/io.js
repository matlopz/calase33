const { Server } = require('socket.io');
const User = require('./models/user');
const Message = require('./models/message');
const { authToken } = require('./utils/jwt');


const initializeIO = (httpServer) => {
  const io = new Server(httpServer);



    io.on('connection', async (socket) => {
    console.log(`Usuario conectado: ${socket.id}`);


    socket.on('message', async data => {
      const user = await User.findOne({ username: data.user });
      const message = new Message({ user: user._id, message: data.message });
      await message.save();

      io.emit('messageLogs', await Message.find().populate('user'));
    });

    socket.on('auth', async data => {
      const user = new User({ username: data });
      await user.save();

      io.emit('messageLogs', await Message.find().populate('user'));
      socket.broadcast.emit('newUser', data);
    });


  });

 
};

module.exports = initializeIO;
