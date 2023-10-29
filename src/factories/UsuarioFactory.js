const UsuarioDAO = require('../dao/usuarioDao');

class UsuarioFactory {
  static createUsuarioDAO() {
    return new UsuarioDAO();
  }
}

module.exports = UsuarioFactory;
