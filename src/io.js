const mongoose = require('mongoose');
const { Server } = require('socket.io');
const cartsService = require('./services/cartsService'); 
//const productsService = require('./services/productsService');
const Products = require('./models/products.models')
const User = require('./models/user');
const Message = require('./models/message');

const initializeIO = (httpServer) => {
  const io = new Server(httpServer);

  io.on('connection', async (socket) => {
    console.log(`Usuario conectado: ${socket.id}`);
    
    socket.on('message', async data => {
      const user = await User.findOne({ username: data.user });
      const message = new Message({ user: user._id, message: data.message });
      await message.save();

      io.emit('messageLogs', await Message.find().populate('user'));
    });

    socket.on('auth', async data => {
      const user = new User({ username: data });
      await user.save();

      io.emit('messageLogs', await Message.find().populate('user'));
      socket.broadcast.emit('newUser', data);
    });
  


  
  


    try {
      
      //const products = await productsService.getAllProducts();
      const products = await Products.find({});
      io.to(socket.id).emit('updateProducts', products);
    } catch (err) {
      console.error('Error al obtener la lista de productos:', err);
    }

    socket.on('addProduct', async (productData) => {
      try {
        const newProduct = new Products({
          _id: new mongoose.Types.ObjectId(), // Generar un nuevo ObjectId automáticamente
          title: productData.title,
          price: productData.price,
          description: productData.description,
          code: productData.code,
          status: productData.status,
          stock: productData.stock,
          category: productData.category,
          thumbnails: productData.thumbnails,
        });

        const addedProduct = await newProduct.save();
        io.emit('updateProducts', await Products.find({}));
        console.log('Nuevo producto:', addedProduct);
      } catch (err) {
        console.error('Error al agregar el producto:', err);
      }
    });
    socket.on('updateProduct', async ({ productId, updatedProduct }) => {
      try {
        //const updatedProductResult = await productsService.updateProduct(productId, updatedProduct);
        const updatedProductResult = await Products.findByIdAndUpdate(productId,updatedProduct)
        if (updatedProductResult) {
          //io.emit('updateProducts', await productsService.getAllProducts());
          io.emit('updateProducts', await Products.find({}))
          console.log('Producto actualizado:', updatedProductResult);
        } else {
          console.log('Producto no encontrado');
        }
      } catch (err) {
        console.error('Error al actualizar el producto:', err);
      }
    });

    socket.on('getProductDetails', async (productId) => {
      try {
        const product = await Products.findById(productId);
        socket.emit('productDetails', product);
      } catch (err) {
        console.error('Error al obtener detalles del producto:', err);
      }
    });
    

    socket.on('deleteProduct', async (productId) => {
      try {
        //await productsService.deleteProduct(productId);
        await Products.findByIdAndDelete(productId)
        //io.emit('updateProducts', await productsService.getAllProducts());
        io.emit('updateProducts', await Products.find({}))
        console.log('Producto eliminado:', productId);
      } catch (err) {
        console.error('Error al eliminar el producto:', err);
      }
    });
  
    socket.on('addToCart', async ({ cartId, productId }) => {
      try {
        let result = await cartsService.addProductToCart(cartId, productId, 1);
        console.log('este es el result: ',result)
    
       
        
//          result = await cartsService.addProductToCart(cartId, [productId]);
   
          io.to(socket.id).emit('productAddedToCart', result);   
          console.log('Producto agregado al carrito:', result);
        
    
      
      } catch (err) {
        console.error('Error al agregar el producto al carrito:', err);
      }
    });
    
    

  });
  return io;
};

module.exports = initializeIO;

