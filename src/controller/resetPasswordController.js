const express = require('express');
const router = express.Router();
const UsuarioService = require('../services/usuarioService');
const { authToken } = require('../utils/jwt');
const usuarioService = new UsuarioService();

router.get('/', async (req, res) => {
    return res.render('reset-password');
});

router.get('/:resetToken', async (req, res) => {
  try {
    const resetToken = req.params.resetToken;
    console.log('que tiene el resetToken en get', resetToken);
    res.render('reset-password');
  } catch (error) {
    console.error('Error al cargar la página de restablecimiento de contraseña con token:', error);
    res.status(500).json({ status: 'error', error: 'Internal Server Error' });
  }
});

router.post('/:resetToken',authToken, async (req, res) => {
    try {     
        const {newPassword} = req.body;
        const userId = req.user;
        const resetToken =userId;

        await usuarioService.restablecerContraseñaConToken(resetToken, newPassword);

        res.status(200).json({ status: 'success', message: 'Contraseña restablecida con éxito' });
    } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        res.status(500).json({ status: 'error', error: 'Internal Server Error' });
    }
});

module.exports = router;