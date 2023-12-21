const Cart = require('../models/carts.Models');

class CartDao {
  async getAllCarts() {
    try {
      const carts = await Cart.find();
      return carts;
    } catch (error) {
      throw new Error('Error fetching carts');
    }
  }

  async createCart() {
    try {
      return await Cart.create({ products: [] });
    } catch (error) {
      throw new Error('Error al crear el carrito');
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await Cart.findById(cartId).populate('products.product');
      return cart;
    } catch (error) {
      throw new Error('Error fetching cart by ID');
    }
  }

  async saveCart(cart) {
    try {

      await cart.save();
    } catch (error) {
      throw new Error('Error saving cart');
    }
  }
}

module.exports = CartDao;
