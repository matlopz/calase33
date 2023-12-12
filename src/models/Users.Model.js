const mongoose = require('mongoose');

const userCollection = 'usuario';

const userSchema = new mongoose.Schema({
  name: String,
  lastname: String,
  number: Number,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  age: Number,
  password: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  documents: [
    {
      name: {
        type: String,
        required: true,
      },
      reference: {
        type: String,
        required: true,
      },
    },
  ],

  last_connection: {
    type: Date,
  },
  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
      },
      quantity: Number,
    },
    
  ],
  role: { type: String, enum: ['user', 'admin', 'premium'], default: 'user' },


});

const Usuarios = mongoose.model(userCollection, userSchema);

module.exports = Usuarios;
