const ProductDAO = require('../dao/product.Dao'); // Ajusta la importación según tu estructura de archivos.

class ProductFactory {
  static createProductDAO() {
    return ProductDAO;
  }
}

module.exports = ProductFactory;
