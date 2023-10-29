const express = require('express');
const router = express.Router();
const productsService= require('../services/productsService');
const { authToken } = require('../utils/jwt');

router.get('/',authToken ,async (req, res) => {
    try {
      console.log('GET Products - Inicio');
      
      const products = await productsService.getAllProducts({})
      console.log('GET Products - Productos encontrados:', products);

      return res.json({products})
      
      //console.log('GET Products - Renderización exitosa');
    } catch (err) {
      console.error('GET Products - Error:', err);
      res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
  });

router.get('/:pid', async (req, res) => {
  try {
    const pid = req.params.pid;
    const product = await productsService.getProductById(pid);
    if (product) {
     // res.json(product);
 res.render(product)
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const newProduct = req.body; // Asegúrate de que los datos se envíen correctamente
    const createdProduct = await productsService.addProduct(newProduct);
    res.status(201).json(createdProduct);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:pid', async (req, res) => {
  try {
    const pid = req.params.pid;
    const updatedProductData = req.body; // Asegúrate de que los datos se envíen correctamente
    const updatedProduct = await productsService.updateProduct(pid, updatedProductData);
    if (updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    const pid = req.params.pid;
    await productsService.deleteProduct(pid);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
