const express = require('express');
const passport = require('passport')
const UsuarioService = require('../services/usuarioService');
const router = express.Router();
const usuarioService = new UsuarioService()

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', passport.authenticate('register', { failureRedirect: '/failregister' }),
  async (req, res) => {

    try {
   
      res.status(201).json({ status: 'success', payload: req.user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: 'error', error: 'Internal Server Error' })

    }
  });

router.get('/failregister', (req, res) => {
  res.json({ status: 'Error', error: 'fallo el register' });
})


router.get('/login', (req, res) => {
  res.render('login')
  
})
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    console.log(req.body)

    const {  token }= await usuarioService.validateUser({email,password})
    
    res
    
      .cookie('authCookie')
      .json({ status: 'success', payload: 'New session initialized', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', error: 'Internal Server Error' });
  }
});



/*router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await Usuarios.findOne({ email })
    if (!user) {
      return res.status(400).json({ status: 'error', error: 'credenciales Invalidas' })
    }
    if (!comparePassword(password, user.password)) {
      return res.status(400).json({ status: 'error', error: 'credenciales Invalidas' })
    }
    req.user = {
      name: user.name,
      id: user.id
    }
    const token = generateToken(user._id)
    console.log('Token generado: ', token)

    console.log('Inicio de sesión exitoso', req.user);
    res
      .cookie('authCookie', token, { maxAge: 15000, httpOnly: true })
      .json({ status: 'success', payload: 'Inicio de Session Correcto', token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', error: 'Internal Server Error' });
  }
});*/

router.get('/failLogin', (req, res) => {
  res.json({ status: 'Error', error: 'fallo al loguearse' });
})

router.get('/github', passport.authenticate('github', { scope: ['user: email'] }), (req, res,) => {

})

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
  try {
    //const cartId = user.cart[0].product.toString();

    req.user = {
      name: user.name,
      id: user.id

    }


    console.log('Inicio de sesión exitoso', req.user);
    res.redirect('/views/productos')
    //res.json({ status: 'success', payload: 'New session initialized' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', error: 'Internal Server Error' });
  }
})


module.exports = router