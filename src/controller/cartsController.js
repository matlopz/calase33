const express = require('express');
const router = express.Router();
const cartsService = require('../services/cartsService');

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
    const cart = req.body;
    const cartId = cart.cartId
    const productId = req.params.pid;
    const result = await cartsService.addProductToCart(cartId, productId);
    res.status(result.statusCode || 200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/:cid/purchase', async (req, res) => {
  const cartId = req.params.cid;
  const user = req.user;
  if (!cartId || !user) {
    return res.status(400).json({ success: false, message: 'Datos de entrada no válidos' });
  }
  try {
    const cart = await cartsService.getCartProducts(cartId);

    if (!cart) {
      return res.status(404).json({ success: false, message: 'El carrito no existe' });
    }
    const { productsNotPurchased, ticket } = await cartsService.purchaseCart(cart, user);
    return res.status(200).json({
      success: true,
      message: 'Compra completada',
      productsNotPurchased,
      ticket,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

module.exports = router;
