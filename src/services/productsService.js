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
  async obtenerProduct(){
    try {

      return this.productRepository.getAllProducts();
    } catch (error) {
      console.error('GET Products - Error:', error);
      throw error;
    }
  }
  async getAllProduct(Id) {
    try {
      const user = await usuarioService.obtenerUsuario(Id);
      console.log(user, 'ACA')

      if (!user) {
        console.error('Usuario no encontrado');
        throw new Error('Usuario no encontrado');
      }

      return this.productRepository.getAllProducts();
    } catch (error) {
      console.error('GET Products - Error:', error);
      throw error;
    }
    
  }
  async getProductById(pid) {
    return this.productRepository.getProductById(pid);
  }

  async addProduct(  product) {
    try {
      
      console.log('que tiene user en add',user)


      

     
      

      return this.productRepository.addProduct(product);
    } catch (error) {
      console.error('Error al agregar el producto:', error);
      throw error;
    }
  }


  async updateProduct( productId, updatedProductData) {
    try {
      const product = await this.productRepository.getProductById(productId);

      if (!product) {
        console.error('Producto no encontrado');
        throw new Error('Producto no encontrado');
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
      console.log('datos de ingreso,', userId, productId);
      const user = await usuarioService.obtenerUsuario(userId);
      const producto = await this.productRepository.getProductById(productId)
      
      if (user.role !== 'premium' && user.email !== producto.owner || producto.owner=== undefined){
        console.error('Permiso denegado para borrar el producto');
        throw new Error('Permiso denegado');
      } else {
        await this.productRepository.deleteProduct(productId);
        return ('producto eliminado')
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
