const ProductFactory = require('../factories/productFactory'); // Ajusta la importación según tu estructura de archivos.

class ProductRepository {
  constructor() {
    this.productDAO = ProductFactory.createProductDAO();
  }

  async getAllProducts() {
    return this.productDAO.getAllProducts();
  }

  async getProductById(productId) {
    return this.productDAO.getProductById(productId);
  }

  async addProduct(newProductData) {
    return this.productDAO.addProduct(newProductData);
  }

  async updateProduct(productId, updatedProductData) {
    return this.productDAO.updateProduct(productId, updatedProductData);
  }

  async deleteProduct(productId) {
    return this.productDAO.deleteProduct(productId);
  }

  async getProductsByQuery(queryParams) {
    return this.productDAO.getProductsByQuery(queryParams);
  }
}

module.exports = ProductRepository;
