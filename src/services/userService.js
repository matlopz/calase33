const { Server } = require('socket.io');
const UsersDao = require('../dao/user.dao');
const User = require('../models/user')

const users = new UsersDao()


const userService = (httpServer)=>{
    const io = new Server(httpServer);
    
  
    io.on('connection', async (socket) => {
      console.log(`Usuario conectado: ${socket.id}`);
      
      socket.on('message', async data => {
        const user = await users.findOne({username: data.user})
        const message = new Message({ user: user._id, message: data.message });
        await message.save();
  
        io.emit('messageLogs', await users.populate('user'));
      });
  
      socket.on('auth', async data => {
        const user = new User({ username: data });
        await user.save();
  
        io.emit('messageLogs', await users.populate('user'));
        socket.broadcast.emit('newUser', data);
      });
    });

}
module.exports = userService