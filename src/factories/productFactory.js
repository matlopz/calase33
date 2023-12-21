const ProductDAO = require('../dao/product.Dao');

class ProductFactory {
  static createProductDAO() {
    return ProductDAO;
  }
}

module.exports = ProductFactory;
