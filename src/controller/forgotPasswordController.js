const express = require('express');
const router = express.Router();
const UsuarioService = require('../services/usuarioService');
const usuarioService = new UsuarioService();


router.get('/', async (req, res) => {
  try {
    const { resetToken } = req.params;
    res.render('forgot-password', { resetToken });
  } catch (error) {
    res.status(500).json({ status: 'error', error: 'Internal Server Error' });
  }
});


router.post('/', async (req, res) => {
  try {
    const email = req.body;
    const token = await usuarioService.validateUserMail(email)
    await usuarioService.enviarCorreoRestablecimientoContraseña({ email, token });
    res
      .cookie('authCookie')
      .status(200).json({ status: 'success', message: 'Correo de restablecimiento enviado', token });
  } catch (error) {

    res.status(500).json({ status: 'error', error: 'Internal Server Error' });
  }
});

module.exports = router;
