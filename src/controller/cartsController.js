const express = require('express');
const router = express.Router();
const cartsService = require('../services/cartsService');
const Chat = require('../io');
const io = Chat()


router.get('/', async (req, res) => {
  try {
    const carts = await cartsService.getAllCarts();
    
    res.json(carts); 
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await cartsService.getCartProducts(cid);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ error: 'Cart not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newCart = await cartsService.createCart()
    res.status(201).json(newCart);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/product/:pid', async (req, res) => {
  try {
    const cart = req.body; // Obtén el cartId de los parámetros de la URL
    const cartId=cart.cartId
    const productId = req.params.pid;
    console.log('cart tiene: ', productId,cartId)
    // Agregar el producto al carrito utilizando el servicio cartsService
    const result = await cartsService.addProductToCart(cartId, productId);




    res.status(result.statusCode || 200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
