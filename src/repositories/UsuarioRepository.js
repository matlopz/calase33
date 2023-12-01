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

  async addPasswordResetToken(email, resetToken) {
    try {
      // Asumo que tienes un método en tu DAO para actualizar el usuario con el token
      return await this.usuarioDAO.addPasswordResetToken(email, resetToken);
    } catch (error) {
      throw new Error('Error al agregar el token de restablecimiento de contraseña');
    }
  }

  async getUserEmail(email) {
    try {
      return await this.usuarioDAO.getUserEmail(email);
    } catch (error) {
      throw new Error('Error al buscar el usuario por correo electrónico');
    }
  }

  async getUserById(id) {
    try {
      return await this.usuarioDAO.getUserById(id);
    } catch (error) {
      throw new Error('Error al buscar el usuario por ID');
    }
  }

  async getUserByResetToken(resetToken) {
    try {
      return await this.usuarioDAO.getUserByResetToken(resetToken);
    } catch (error) {
      throw new Error('Error al buscar el usuario por token de restablecimiento de contraseña en el repositorio');
    }
  }
}

module.exports = UsuarioRepository;
