const express = require('express');
const Products = require('../models/products.models');
const HTTP_STATUS_CODE = require('../constants/error.constants');
const productsService = require('../services/productsService')
const mongoose = require('mongoose');
const ProductDTO = require('../dto/product.dto');
const { authToken } = require('../utils/jwt');
const UsuarioService = require('../services/usuarioService');
const uploader = require('../utils/multer');
const usuarioService = new UsuarioService()



const router = express.Router();

router.get('/', (req, res) => {
  res.render('realTimeProducts')
  
})
router.get('/prod', authToken, async (req, res) => {
  try {
    const Id = req.user;
    console.log(Id);

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
    const files = req.files; 
    console.log('estas por ACA::',files)
    
    const userId = req.user;
    const user = await usuarioService.obtenerUsuario(userId);

    if (user.role !== 'premium') {
      throw new Error('Solo los usuarios premium pueden crear productos.');
    }

    const thumbnailPaths = files.map(file => file.path);

    const addedProduct = new Products({
      _id: new mongoose.Types.ObjectId(),
      owner: user.email,
      ...req.body,
      thumbnails: thumbnailPaths, 
    });
    await productsService.addProduct(addedProduct);
    const products = await productsService.getAllProducts(userId);

    res.status(HTTP_STATUS_CODE.OK).json(products);
    console.log('POST /realTimeProducts - Respuesta JSON enviada');

    next();
  } catch (err) {
    console.error('POST /realTimeProducts - Error:', err);
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
  }
});

router.put('/:productId',authToken, async (req, res) => {
  try {
    const pid = req.params.productId;
    const updatedProduct = req.body.updatedProduct;
    const userId = req.user;
    const user = await usuarioService.obtenerUsuario(userId);
    if (user.role !== 'premium') {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({ error: 'Unauthorized' });
    }

    const updatedProductResult = await productsService.updateProduct(pid, updatedProduct);

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

router.delete('/:productId', authToken, async (req, res,next) => {
  try {
    const productId = req.params.productId;
    const userId = req.user;
    console.log('ESTOy por ACCAA:::',productId,userId)
    await productsService.deleteProduct(userId, productId);
    const products = await productsService.getAllProducts(userId);
    res.status(HTTP_STATUS_CODE.OK).json({ message: 'Product deleted successfully',products });
    next();
  } catch (err) {
    if (err.message === 'Product not found') {
      res.status(HTTP_STATUS_CODE.NOT_FOUND).json({ error: 'Product not found' });
    } else {
      res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
  }
});

module.exports = router;
