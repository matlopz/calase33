// resetPasswordController.js
const express = require('express');
const router = express.Router();
const UsuarioService = require('../services/usuarioService');
const usuarioService = new UsuarioService();

// Manejar la ruta GET para restablecer contraseña con token
router.get('/', async (req, res) => {
  try {
    const { resetToken } = req.params;
    // Puedes realizar alguna validación del token aquí si es necesario

    res.render('forgot-password', { resetToken }); // Renderizar la plantilla HTML con el token como parámetro
  } catch (error) {
    console.error('Error al cargar la página de restablecimiento de contraseña:', error);
    res.status(500).json({ status: 'error', error: 'Internal Server Error' });
  }
});


router.post('/', async (req, res) => {
    try {
      const email   = req.body;
      console.log('email tiene',email)
      const  token = await usuarioService.validateUserMail(email)
      await usuarioService.enviarCorreoRestablecimientoContraseña({email,token});
      res
      .cookie('authCookie')
      .status(200).json({ status: 'success', message: 'Correo de restablecimiento enviado',token });
    } catch (error) {
      console.error('Error al solicitar restablecimiento de contraseña:', error);
      res.status(500).json({ status: 'error', error: 'Internal Server Error' });
    }
  });

module.exports = router;
