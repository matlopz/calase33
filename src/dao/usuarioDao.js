const Usuarios = require('../models/Users.Model');

class UsuarioDAO {
  async createUser(newUser) {
    try {
      return await Usuarios.create(newUser);
    } catch (error) {
      throw new Error('Error al crear un usuario');
    }
  }

  async addPasswordResetToken(email, resetToken) {
    try {
      return await Usuarios.updateOne({ email }, { passwordResetToken: resetToken, passwordResetExpires: Date.now() + 3600000 });
    } catch (error) {
      throw new Error('Error al agregar el token de restablecimiento de contraseña en DAO');
    }
  }

  async getUserEmail(email) {
    try {
      return await Usuarios.findOne({ email });
    } catch (error) {
      throw new Error('Error al buscar el usuario por correo electrónico');
    }
  }

  async getUserById(id) {
    try {
      return await Usuarios.findById(id);
    } catch (error) {
      throw new Error('Error al buscar el usuario por ID en DAO');
    }
  }

  async getUserByResetToken(resetToken) {
    try {
      return await Usuarios.findOne({
        $and: [
          { _id: resetToken }

        ]
      });
    } catch (error) {
      throw new Error('Error al buscar el usuario por token de restablecimiento de contraseña en DAO');
    }
  }
  async updateUserRole(userId, newRole) {
    try {
      return await Usuarios.findByIdAndUpdate(userId, { role: newRole }, { new: true });
    } catch (error) {
      throw new Error('Error al actualizar el rol del usuario en DAO');
    }
  }


}

module.exports = UsuarioDAO;
