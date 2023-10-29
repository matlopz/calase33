const Usuarios = require('../models/Users.Model')

class UsuarioDAO  {
    async createUser(newUser) {
      try {
        return await Usuarios.create(newUser);
        
      } catch (error) {
        throw new Error('Error al crear un usuario');
      }
    }

    async getUserEmail(email) {
        try {
          return await Usuarios.findOne({email});
        } catch (error) {
          throw new Error('Error al buscar el usuario por correo electrónico');
        }
      }
      async getUserById(id) {
        try {
          return await Usuarios.findById(id);

        } catch (error) {
          throw new Error('Error al buscar el usuario por ID En dao');
        }
      }
  };

module.exports = UsuarioDAO