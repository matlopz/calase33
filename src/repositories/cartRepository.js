const CartFactory = require('../factories/cartFactory');


class CartRepository {
  constructor() {
    this.cartFactory = CartFactory.createCartDAO();
  }
  async createCart() {
    try {
      return await this.cartFactory.createCart();
    } catch (error) {
      throw new Error('Error al crear un carrito');
    }
  }

  async getAllCarts() {
    try {
      return await this.cartFactory.getAllCarts();
    } catch (error) {
      throw new Error('Error fetching carts');
    }
  }

  async getCartById(cartId) {
    try {
      return await this.cartFactory.getCartById(cartId);
    } catch (error) {
      throw new Error('Error fetching cart by ID');
    }
  }

  async saveCart(cart) {
    try {
      await this.cartFactory.saveCart(cart);
    } catch (error) {
      throw new Error('Error saving cart');
    }
  }
}

module.exports = CartRepository;
