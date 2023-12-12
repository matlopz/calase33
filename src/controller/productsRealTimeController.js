const express = require('express');
const Chat = require('../io');
const Products = require('../models/products.models');
const HTTP_STATUS_CODE = require('../constants/error.constants');
const productsService = require('../services/productsService')
const mongoose = require('mongoose');
const ProductDTO = require('../dto/product.dto');
const { authToken } = require('../utils/jwt');
const UsuarioService = require('../services/usuarioService');
const uploader = require('../utils/multer');
const io = Chat()
const usuarioService = new UsuarioService()



const router = express.Router();

router.get('/', (req, res) => {
  res.render('realTimeProducts')
  
})
router.get('/prod', authToken, async (req, res) => {
  try {
    const Id = req.user;
    console.log(Id);

    // Aquí asumimos que productsService.getAllProducts() devuelve todos los productos
    const products = await productsService.getAllProduct(Id);

    console.log('GET /realTimeProducts - Renderización exitosa',products);
    res.json({ products });
    
  } catch (err) {
    console.error('GET /realTimeProducts - Error:', err);
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
  }
});





router.post('/', authToken, uploader.array('productThumbnails'), async (req, res, next) => {
  try {
    const files = req.files; // files en lugar de file para manejar múltiples archivos
    console.log(files, 'yooo::::');
    
    const userId = req.user;
    const user = await usuarioService.obtenerUsuario(userId);

    console.log('POST /realTimeProducts - Inicio', user);

    if (user.role !== 'premium') {
      throw new Error('Solo los usuarios premium pueden crear productos.');
    }

    // Si estás recibiendo múltiples archivos, crea un array de rutas de imágenes
    const thumbnailPaths = files.map(file => file.path);

    // Crear tu objeto de producto con la información del archivo si está presente
    console.log(req.body,'producto mandado::::::');
    const addedProduct = new Products({
      _id: new mongoose.Types.ObjectId(),
      owner: user.email,
      ...req.body,
      thumbnails: thumbnailPaths, // Usar el array de rutas de imágenes
    });

    await addedProduct.save();
    console.log('POST /realTimeProducts - Nuevo producto guardado:', addedProduct);

    console.log('POST /realTimeProducts - Emitido evento "addProduct"');

    const products = await productsService.getAllProducts(userId);
    console.log('POST /realTimeProducts - Productos encontrados:', products);

    res.status(HTTP_STATUS_CODE.OK).json(products);
    console.log('POST /realTimeProducts - Respuesta JSON enviada');

    next();
  } catch (err) {
    console.error('POST /realTimeProducts - Error:', err);
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
  }
});



// Código del lado del servidor (Node.js/Express)
router.put('/:productId',authToken, async (req, res) => {
  try {
    console.log('Solicitud PUT recibida');
    const pid = req.params.productId;
    const updatedProduct = req.body.updatedProduct;
    const userId = req.user;
    console.log('Datos que tiene:', pid, updatedProduct, userId);

    const user = await usuarioService.obtenerUsuario(userId);
    if (user.role !== 'premium') {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({ error: 'Unauthorized' });
    }

    const updatedProductResult = await productsService.updateProduct(pid, updatedProduct);
    console.log('Resultado de la actualización:', updatedProductResult);

    if (updatedProductResult) {
      res.status(HTTP_STATUS_CODE.OK).json(updatedProductResult);
    } else {
      res.status(HTTP_STATUS_CODE.OK).json({ error: 'Product not found' });
    }
  } catch (err) {
    console.error('Error al actualizar el producto:', err);
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
  }
});



router.delete('/:productId', authToken, async (req, res) => {
  try {
    const productId = req.params.productId;
    const userId = req.user;
    console.log('que tiene esto:', {productId, userId});
    await productsService.deleteProduct(userId, productId);
    
    res.status(HTTP_STATUS_CODE.OK).json({ message: 'Product deleted successfully' });
  } catch (err) {
    if (err.message === 'Product not found') {
      res.status(HTTP_STATUS_CODE.NOT_FOUND).json({ error: 'Product not found' });
    } else {
      res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
  }
});




module.exports = router;
