const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
