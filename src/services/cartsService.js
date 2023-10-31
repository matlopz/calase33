const CartRepository = require('../repositories/cartRepository');
const productsService = require('./productsService');
const HTTP_STATUS_CODE = require('../constants/error.constants');
const TicketService = require('./ticketService');

const cartsService = {
  async getAllCarts() {
    try {
      return await CartRepository.getAllCarts();
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Error al obtener carritos');
    }
  },

  async createCart() {
    try {
      return await CartRepository.saveCart(await CartRepository.createEmptyCart());
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Error al crear el carrito');
    }
  },

  async getCartProducts(cartId) {
    try {
      if (!cartId || cartId === 'null') {
        throw new Error('El cartId es nulo o no válido');
      }
      return await CartRepository.getCartById(cartId.toString());
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Error al obtener carrito');
    }
  },

  async addProductToCart(cartId, productId) {
    try {
      console.log('Dato de entrada', cartId);

     
      const product = await productsService.getProductById(productId);

      if (!product) {
        return { error: 'El producto no existe', statusCode: HTTP_STATUS_CODE.NOT_FOUND };
      }

      const cart = await CartRepository.getCartById(cartId);
      console.log('Mi carrito ahora tiene', cart);

      if (!cart) {
        return { error: 'El carrito no existe' };
      }

      const existingProduct = cart.products.find(item => item.product.equals(productId));

      if (existingProduct) {
        let quantity = existingProduct.quantity;
        quantity += 1;
        console.log('Sí tiene un producto agregado');
        existingProduct.quantity = quantity;
      } else {
        cart.products.push({ product: productId, quantity: 1 });
        console.log('No tiene un producto agregado');
      }

      try {
        await CartRepository.saveCart(cart);
        console.log('Carrito guardado con éxito.');
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
  },

  async incrementProductQuantity(cartId, productId) {
    try {
      
      const product = await productsService.getProductById(productId);

      if (!product) {
        return { error: 'El producto no existe', statusCode: HTTP_STATUS_CODE.NOT_FOUND };
      }

      const cart = await CartRepository.getCartById(cartId);

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

      await CartRepository.saveCart(cart);

      return {
        updatedProduct: existingProduct,
      };
    } catch (error) {
      throw new Error('Error al incrementar la cantidad del producto en el carrito: ' + error.message);
    }
  },

  async decrementProductQuantity(cartId, productId) {
    try {
    
      const product = await productsService.getProductById(productId);

      if (!product) {
        return { error: 'El producto no existe', statusCode: HTTP_STATUS_CODE.NOT_FOUND };
      }

      const cart = await CartRepository.getCartById(cartId);

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

      await CartRepository.saveCart(cart);

      return {
        updatedProduct: existingProduct,
      };
    } catch (error) {
      throw new Error('Error al decrementar la cantidad del producto en el carrito: ' + error.message);
    }
  },
  async deleteProductFromCart(cartId, productId) {
    try {
       
        const cart = await CartRepository.getCartById(cartId);
        if (!cart) {
            return { error: 'El carrito no existe' };
        }

        // Encuentra y elimina el producto del carrito
        const productIndex = cart.products.findIndex(item => item.product.equals(productId));
        if (productIndex !== -1) {
            cart.products.splice(productIndex, 1);
        }

        try {
            
            await CartRepository.saveCart(cart);
        } catch (error) {
            console.error('Error al guardar el carrito:', error);
            throw new Error('Error al guardar el carrito');
        }

        return { success: true };
    } catch (error) {
        throw new Error('Error al eliminar producto del carrito: ' + error.message);
    }
},

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

  await CartRepository.saveCart(cart);

  return { productsNotPurchased, ticket };
}

}

module.exports = cartsService;
