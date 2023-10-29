const UsuarioFactory = require('../factories/UsuarioFactory');

class UsuarioRepository {
  constructor() {
    this.usuarioDAO = UsuarioFactory.createUsuarioDAO();
  }

  async createUser(newUser) {
    try {
      return await this.usuarioDAO.createUser(newUser);
    } catch (error) {
      throw new Error('Error al crear un usuario');
    }
  }

  async getUserEmail(email) {
    try {
      return await this.usuarioDAO.getUserEmail(email)
    } catch (error) {
      throw new Error('Error al buscar el usuario por correo electrónico');
    }
  }
  async getUserById(id) {
    try {
      return await this.usuarioDAO.getUserById(id)
    } catch (error) {
      throw new Error('Error al buscar el usuario por ID');
    }
  }
}

module.exports = UsuarioRepository;
