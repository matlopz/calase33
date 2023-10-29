const express = require('express');
const HTTP_STATUS_CODE = require('../constants/error.constants');
const productsService = require('../services/productsService')
const cartsService = require('../services/cartsService')
const passportCall = require('../utils/passport.call');
const { authToken } = require('../utils/jwt');

const router = express.Router();


router.get('/productos', async (req, res) => {
  return res.render('products')
})
 
// En tu enrutamiento
router.get('/product', authToken, async (req, res) => {
  try {
    const id = req.user;
    console.log('Tiene esta variable ID ROUTER: ', id);

    let usuario, cartId, products; 

    if (id) {
      const result = await productsService.getAllProducts(id);
      cartId = result.cartId;
      products = result.products;
      usuario = result.usuario; 
      console.log('que tiene RESULT: ', usuario, cartId, products);
    } else {
      res.status(401).json({ status: 'Error', error: 'No autorizado' });
      return; 
    }

    res.json({ cartId, usuario, products }); 
  } catch (err) {
    console.error('GET Products - Error:', err);
    res.status(401).json({ error: 'No autorizado' });
  }
});



router.get('/carritos/:cid', async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await cartsService.getCartProducts(cid);
    cartRender = cart.products
    if (cart) {
      res.render('carts', { cartRender });
    } else {
      res.status(404).json({ error: 'Cart not found' });
    }
  } catch (err) {
    console.error('GET carts - Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/logout', async (req, res) => {
  res.destroy('connect.sid')
  console.log('desologuear al cliente: ', res.clearCookie('cookieDelProyecto'))
  res.redirect('/auth/login');

})
router.post('/carts/product/:productId/increment', async (req, res) => {
  try {
    const productId = req.params.productId;
    const cartId = req.body.cartId; 
    console.log(cartId,'ESTO TIENE')

    
    const result = await cartsService.incrementProductQuantity(cartId, productId);

    res.status(result.statusCode || 200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/carts/product/:productId/decrement', async (req, res) => {
  try {
    const productId = req.params.productId;
    const cartId = req.body.cartId; 
    
    const result = await cartsService.decrementProductQuantity(cartId, productId);

    res.status(result.statusCode || 200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.post('/carts/product/:productId/delete', async (req, res) => {
  try {
      const productId = req.params.productId;
      const cartId = req.body.cartId;

      const result = await cartsService.deleteProductFromCart(cartId, productId);

      res.status(200).json({result, message: 'Producto eliminado exitosamente' });
  } catch (err) {
      console.error('Error en la ruta de eliminación de producto:', err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
