const CartDao = require('../dao/cartDao');

class CartFactory {
  static createCartDAO() {
    return new CartDao();
  }
}

module.exports = CartFactory;

