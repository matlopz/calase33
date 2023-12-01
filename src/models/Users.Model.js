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
  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
      },
      quantity: Number,
    },
  ],
  role: {
    type: String,
    default: 'user',
  },
  premium: {
    type: Boolean,
    default: false,
  },
});

const Usuarios = mongoose.model(userCollection, userSchema);

module.exports = Usuarios;
