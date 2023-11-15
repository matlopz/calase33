const {cartRepository}= require('../repositories/index');
const productsService = require('./productsService');
const HTTP_STATUS_CODE = require('../constants/error.constants');
const TicketService = require('./ticketService');

class CartsService  {
  constructor() {
   
  }

  async getAllCarts() {
    try {
      return await cartRepository.getAllCarts();
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Error al obtener carritos');
    }
  }

  async createCart() {
    try {
      return await cartRepository.saveCart(await cartRepository.createCart());
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Error al crear el carrito');
    }
  }

  async getCartProducts(cartId) {
    try {
      if (!cartId || cartId === 'null') {
        throw new Error('El cartId es nulo o no válido');
      }
      return await cartRepository.getCartById(cartId.toString());
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Error al obtener carrito');
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      const product = await productsService.getProductById(productId);
  
      if (!product) {
        return { error: 'El producto no existe', statusCode: HTTP_STATUS_CODE.NOT_FOUND };
      }
  
      const cart = await cartRepository.getCartById(cartId);
  
      if (!cart) {
        return { error: 'El carrito no existe' };
      }
  
      const existingProduct = cart.products.find(item => item.product.equals(productId));
  
      if (existingProduct) {
        if (product.stock > 0) {
          // Solo si el producto tiene stock disponible, se agrega al carrito
          cart.products.push({ product: productId, quantity: 1 });
          
          await product.save();
        } else {
          console.log('El producto no tiene stock disponible');
          return { error: 'El producto no tiene stock disponible' };
        }
      } else {
        if (product.stock > 0) {
          // Si el producto tiene stock disponible, se agrega al carrito.
          cart.products.push({ product: productId, quantity: 1 });
          
          await product.save();
        } else {
          console.log('El producto no tiene stock disponible');
          return { error: 'El producto no tiene stock disponible' };
        }
      }
  
      try {
        await cartRepository.saveCart(cart);
      } catch (error) {
        console.error('Error al guardar el carrito:', error);
        throw new Error('Error al guardar el carrito');
      }
  
      return {
        addedProduct: existingProduct || cart.products[cart.products.length - 1],
        isNewProduct: !existingProduct,
      };
    } catch (error) {
      throw new Error('Error al agregar producto al carrito: ' + error.message);
    }
  }
  
  
  

  async incrementProductQuantity(cartId, productId) {
    try {
      
      const product = await productsService.getProductById(productId);

      if (!product) {
        return { error: 'El producto no existe', statusCode: HTTP_STATUS_CODE.NOT_FOUND };
      }

      const cart = await cartRepository.getCartById(cartId);

      if (!cart) {
        return { error: 'El carrito no existe' };
      }

      const existingProduct = cart.products.find(item => item.product.equals(productId));

      if (existingProduct) {
        let quantity = existingProduct.quantity;
        quantity += 1;
        existingProduct.quantity = quantity;
      } else {
        return { error: 'El producto no está en el carrito' };
      }

      await cartRepository.saveCart(cart);

      return {
        updatedProduct: existingProduct,
      };
    } catch (error) {
      throw new Error('Error al incrementar la cantidad del producto en el carrito: ' + error.message);
    }
  }

  async decrementProductQuantity(cartId, productId) {
    try {
    
      const product = await productsService.getProductById(productId);

      if (!product) {
        return { error: 'El producto no existe', statusCode: HTTP_STATUS_CODE.NOT_FOUND };
      }

      const cart = await cartRepository.getCartById(cartId);

      if (!cart) {
        return { error: 'El carrito no existe' };
      }

      const existingProduct = cart.products.find(item => item.product.equals(productId));

      if (existingProduct) {
        let quantity = existingProduct.quantity;
        if (quantity > 0) {
          quantity -= 1;
          existingProduct.quantity = quantity;
        } else {
          return { error: 'La cantidad del producto ya es cero' };
        }
      } else {
        return { error: 'El producto no está en el carrito' };
      }

      await cartRepository.saveCart(cart);

      return {
        updatedProduct: existingProduct,
      };
    } catch (error) {
      throw new Error('Error al decrementar la cantidad del producto en el carrito: ' + error.message);
    }
  }

  async deleteProductFromCart(cartId, productId) {
    try {
       
        const cart = await cartRepository.getCartById(cartId);
        if (!cart) {
            return { error: 'El carrito no existe' };
        }

        // Encuentra y elimina el producto del carrito
        const productIndex = cart.products.findIndex(item => item.product.equals(productId));
        if (productIndex !== -1) {
            cart.products.splice(productIndex, 1);
        }

        try {
            
            await cartRepository.saveCart(cart);
        } catch (error) {
            console.error('Error al guardar el carrito:', error);
            throw new Error('Error al guardar el carrito');
        }

        return { success: true };
    } catch (error) {
        throw new Error('Error al eliminar producto del carrito: ' + error.message);
    }
}

async purchaseCart(cart, user) {
  if (!cart || !user) {
    throw new Error('Datos de entrada no válidos');
  }

  const cartProducts = cart.products;
  const productsNotPurchased = [];

  for (const cartProduct of cartProducts) {
    const product = await productsService.getProductById(cartProduct.product);

    if (!product) {
      productsNotPurchased.push(cartProduct.product);
    } else if (product.stock >= cartProduct.quantity) {
      product.stock -= cartProduct.quantity;
      await product.save();
    } else {
      productsNotPurchased.push(cartProduct.product);
    }
  }

  
  const updatedCartProducts = cartProducts.filter((cartProduct) => {
    return !productsNotPurchased.includes(cartProduct.product);
  });

  cart.products = updatedCartProducts;


  let ticket = null;
  if (cartProducts.length > productsNotPurchased.length) {
    ticket = await TicketService.generateTicket(cart, user);
    console.log('que tiene tiket del lado de cart.', ticket);
  }

  await cartRepository.saveCart(cart);

  return { productsNotPurchased, ticket };
}

}
module.exports = new CartsService();
