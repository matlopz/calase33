const ProductRepository = require('../repositories/productRepository'); 
const UsuarioService = require('./usuarioService');
const usuarioService = new UsuarioService();

class ProductService {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getAllProducts(id) {
    try {
      const user = await usuarioService.obtenerUsuario(id);

      if (!user) {
        console.error('Usuario no encontrado');
        throw new Error('Usuario no encontrado');
      }

      const usuario = {
        name: user.name,
        id: user.id,
      };

      const cartId = user.cart[0].product.toString();

      if (!cartId) {
        console.error('El usuario no tiene un carrito válido');
        throw new Error('Usuario sin carrito');
      }

      const products = await this.productRepository.getAllProducts();

      return { cartId, products, usuario };
    } catch (error) {
      console.error('GET Products - Error:', error);
      throw error;
    }
  }
  async getAllProduct(){
    return this.productRepository.getAllProducts();
  }
  async getProductById(pid) {
    return this.productRepository.getProductById(pid);
  }

  async addProduct(product) {
    return this.productRepository.addProduct(product);
  }

  async updateProduct(pid, updatedProduct) {
    return this.productRepository.updateProduct(pid, updatedProduct);
  }

  async deleteProduct(pid) {
    return this.productRepository.deleteProduct(pid);
  }

  async getProductsByQuery(queryParams) {
    return this.productRepository.getProductsByQuery(queryParams);
  }
}

module.exports = new ProductService();
