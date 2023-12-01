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
      console.log(user, 'ACA')

      if (!user) {
        console.error('Usuario no encontrado');
        throw new Error('Usuario no encontrado');
      }

      const usuario = {
        name: user.name,
        id: user.id,
      };

      const cartId = user.cart[0].product;
      console.log('que tiene products', cartId)

      if (!cartId) {
        console.error('El usuario no tiene un carrito válido');
        throw new Error('Usuario sin carrito');
      }

      const products = await this.productRepository.getAllProducts()
      console.log('que tiene products', products)

      return { cartId, products, usuario };
    } catch (error) {
      console.error('GET Products - Error:', error);
      throw error;
    }
  }
  async getAllProduct() {
    return this.productRepository.getAllProducts();
  }
  async getProductById(pid) {
    return this.productRepository.getProductById(pid);
  }

  async addProduct(userId, product) {
    try {
      const user = await usuarioService.obtenerUsuario(userId);


      if (user.role !== 'premium') {
        throw new Error('Solo los usuarios premium pueden crear productos.');
      }


      productData.owner = user.email;

      return this.productRepository.addProduct(product);
    } catch (error) {
      console.error('Error al agregar el producto:', error);
      throw error;
    }
  }


  async updateProduct(userId, productId, updatedProductData) {
    try {
      const product = await Product.findById(productId);

      if (!product) {
        console.error('Producto no encontrado');
        throw new Error('Producto no encontrado');
      }

      
      if (product.owner.toString() !== userId && !user.premium) {
        console.error('Permiso denegado para actualizar el producto');
        throw new Error('Permiso denegado');
      }

      const updatedProduct = await this.productRepository.updateProduct(productId, updatedProductData, { new: true });

      if (!updatedProduct) {
        console.error('Producto no encontrado');
        throw new Error('Producto no encontrado');
      }

      return updatedProduct;
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      throw error;
    }
  }

  async deleteProduct(userId, productId) {
    try {
      const product = await Product.findById(productId);

      if (!product) {
        console.error('Producto no encontrado');
        throw new Error('Producto no encontrado');
      }

      // Verificar si el usuario tiene permisos
      if (product.owner.toString() !== userId && !user.premium) {
        console.error('Permiso denegado para borrar el producto');
        throw new Error('Permiso denegado');
      }

      const deletedProduct = await Product.findByIdAndDelete(productId);

      if (!deletedProduct) {
        console.error('Producto no encontrado');
        throw new Error('Producto no encontrado');
      }
    } catch (error) {
      console.error('Error al borrar el producto:', error);
      throw error;
    }
  }

  async getProductsByQuery(queryParams) {
    return this.productRepository.getProductsByQuery(queryParams);
  }
}

module.exports = new ProductService();
