const express = require('express');
const Chat = require('../io');
const Products = require('../models/products.models');
const HTTP_STATUS_CODE = require('../constants/error.constants');
const productsService = require('../services/productsService')
const mongoose = require('mongoose');
const ProductDTO = require('../dto/product.dto');
const { authToken } = require('../utils/jwt');
const io = Chat()


const router = express.Router();


router.get('/', async (req, res) => {
  try {
    console.log('GET /realTimeProducts - Inicio');
    
    const products = await productsService.getAllProduct()
    console.log('GET /realTimeProducts - Productos encontrados:', products);
    
    res.render('realTimeProducts', { products });
    console.log('GET /realTimeProducts - Renderización exitosa');
  } catch (err) {
    console.error('GET /realTimeProducts - Error:', err);
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
  }
});


router.post('/realTimeProducts', async (req, res) => {
  try {
    console.log('POST /realTimeProducts - Inicio');
    
    const newProduct = new ProductDTO(req.body)
    const addedProduct = new Products({
      _id: new mongoose.Types.ObjectId(),
      ...newProduct,
    });

    await addedProduct.save();
    console.log('POST /realTimeProducts - Nuevo producto guardado:', addedProduct);
    
    io.emit('addProduct', addedProduct);
    console.log('POST /realTimeProducts - Emitido evento "addProduct"');
    
    const products = await productsService.getAllProducts({});
    console.log('POST /realTimeProducts - Productos encontrados:', products);
    
    res.status(HTTP_STATUS_CODE.OK).json(addedProduct);
    console.log('POST /realTimeProducts - Respuesta JSON enviada');
  } catch (err) {
    console.error('POST /realTimeProducts - Error:', err);
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
  }
});

router.put('/realTimeProducts/:pid', authToken,async (req, res) => {
  try {
    const pid = req.params.pid;
    const updatedProduct = req.body;
    const userId = req.user;
    // const updatedProductResult = await productsService.updateProduct(pid, updatedProduct);
    const updatedProductResult = await productsService.updateProduct(userId,pid, updatedProduct);
    console.log('Resultado de la actualización:', updatedProductResult); 
    if (updatedProductResult) {
      io.emit('productUpdated', updatedProductResult);
      res.status(HTTP_STATUS_CODE.OK).json(updatedProductResult);
    } else {
      res.status(HTTP_STATUS_CODE.NOT_FOUND).json({ error: 'Product not found' });
    }
  } catch (err) {
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
  }
});

router.delete('/realTimeProducts/:pid', async (req, res) => {
  try {
    const pid = req.params.pid;
    // await productsService.deleteProduct(pid);
    await productsService.deleteProduct(pid);
    io.emit('deleteProduct', pid);
    res.status(HTTP_STATUS_CODE.OK).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
