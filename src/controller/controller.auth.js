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
    const { email, password } = req.body;
    const { user, token } = await usuarioService.validateUser({ email, password });
    if (!user) {
      res.status(401).json({ status: 'error', error: 'Invalid credentials' });
    } else {
      res.json({ status: 'success', payload: 'New session initialized', token, user });
    }
  } catch (error) {

    res.status(500).json({ status: 'error', error: 'Internal Server Error' });
  }
});


router.get('/failLogin', (req, res) => {
  res.json({ status: 'Error', error: 'fallo al loguearse' });
})

router.get('/github', passport.authenticate('github', { scope: ['user: email'] }), (req, res,) => {

})

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
  try {
    req.user = {
      name: user.name,
      id: user.id
    }
    res.redirect('/views/productos')
  } catch (error) {

    res.status(500).json({ status: 'error', error: 'Internal Server Error' });
  }
})


module.exports = router