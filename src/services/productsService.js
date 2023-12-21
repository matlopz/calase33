const { messageRepository } = require('../repositories/index');
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

        throw new Error('Usuario no encontrado');
      }

      const usuario = {
        name: user.name,
        id: user.id,
      };

      const cartId = user.cart[0].product;


      if (!cartId) {

        throw new Error('Usuario sin carrito');
      }

      const products = await this.productRepository.getAllProducts()


      return { cartId, products, usuario };
    } catch (error) {

      throw error;
    }
  }
  async obtenerProduct() {
    try {

      return this.productRepository.getAllProducts();
    } catch (error) {

      throw error;
    }
  }
  async getAllProduct(Id) {
    try {
      const user = await usuarioService.obtenerUsuario(Id);


      if (!user) {

        throw new Error('Usuario no encontrado');
      }

      return this.productRepository.getAllProducts();
    } catch (error) {

      throw error;
    }

  }
  async getProductById(pid) {
    return this.productRepository.getProductById(pid);
  }

  async addProduct(product) {
    try {


      return this.productRepository.addProduct(product);
    } catch (error) {

      throw error;
    }
  }


  async updateProduct(productId, updatedProductData) {
    try {
      const product = await this.productRepository.getProductById(productId);

      if (!product) {

        throw new Error('Producto no encontrado');
      }




      const updatedProduct = await this.productRepository.updateProduct(productId, updatedProductData, { new: true });

      if (!updatedProduct) {

        throw new Error('Producto no encontrado');
      }

      return updatedProduct;
    } catch (error) {

      throw error;
    }
  }

  async deleteProduct(userId, productId) {
    try {

      const user = await usuarioService.obtenerUsuario(userId);
      const producto = await this.productRepository.getProductById(productId)

      if (user.role !== 'premium' && user.email !== producto.owner || producto.owner === undefined) {

        throw new Error('Permiso denegado');
      } else {
        const messageInfo = {
          email: user.email,
          name: user.name,
          lastname: user.lastname,
          id: producto._id,
          productName: producto.title,
        };
        await messageRepository.messageAdapter.sendDeletedProduct(messageInfo)
        await this.productRepository.deleteProduct(productId);
        return ('producto eliminado')
      }




    } catch (error) {

      throw error;
    }
  }

  async getProductsByQuery(queryParams) {
    return this.productRepository.getProductsByQuery(queryParams);
  }
}

module.exports = new ProductService();
