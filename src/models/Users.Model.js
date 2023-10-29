const mongoose = require('mongoose')

const userCollection = 'usuario'

const userSchema = new mongoose.Schema({
  name: String,
  lastname: String,
  number: Number,
  email: {
    type: String,
    unique: true, 
    required: true, 
  },
  age:Number,
  
  password: String,
  cart: [ 
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
      },
      quantity: Number,
    },
  ],
  /*cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: Number,
    },
  ],*/
  role: {
    type: String,
    default: 'user', 
  },
})

const Usuarios = mongoose.model(userCollection, userSchema)

module.exports = Usuarios