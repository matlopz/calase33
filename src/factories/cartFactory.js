const CartDao = require('../dao/cartDao');

class CartFactory {
  constructor() {
    this.cartDao = new CartDao();
  }

  async getAllCarts() {
    return await this.cartDao.getAllCarts();
  }

  async getCartById(cartId) {
    return await this.cartDao.getCartById(cartId);
  }

  async saveCart(cart) {
    return await this.cartDao.saveCart(cart);
  }

  async createEmptyCart() {
    try {
      return await this.cartDao.createCart();
    } catch (error) {
      throw new Error('Error al crear el carrito');
    }
  }
}

module.exports = CartFactory;
