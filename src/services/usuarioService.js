

const UsuarioRepository = require('../repositories/UsuarioRepository');
//const cartsService = require('.cartsService');
const { comparePassword, getHashedPassword } = require('../utils/bcrypts');
const { generateToken, authToken } = require('../utils/jwt');
const { messageRepository, cartRepository } = require('../repositories/index'); // Asegúrate de ajustar la importación según tu estructura real de archivos.


class UsuarioService {

  constructor() {
    this.usuarioRepository = new UsuarioRepository();
  }

  async obtenerUsuario(Id) {
    try {
      const user = await this.usuarioRepository.getUserById(Id)

      if (!user) {

        throw new Error('Usuario no encontrado');
      }
      return user
    } catch (error) {
      throw new Error('Error al buscar el usuario por ID en usuario service');
    }
  }

  async validarEmail({ email }) {
    try {

      const user = await this.usuarioRepository.getUserEmail(email);

      if (user) {

        return null;
      }
    } catch (error) {
      throw new Error('Error al buscar el usuario por correo electrónico');
    }
  }

  async createUser(userDto) {
    try {

      const { name, lastname, email, age, password, number } = userDto;
      if (!name || !email || !password) {
        throw new Error('Faltan datos obligatorios');
      }
      const hashedPassword = getHashedPassword(password);

      const newUser = await this.usuarioRepository.createUser({
        name,
        lastname,
        email,
        age,
        number,
        password: hashedPassword,
        cart: [],
      });


      const cart = await cartRepository.createCart({ product: [] })

      newUser.cart.push({ product: cart._id, quantity: 0 });

      const messageInfo = {
        name: newUser.name,
        number: newUser.number,
        email: newUser.email,
        lastname: newUser.lastname,
      };


      await messageRepository.sendMessage(messageInfo)
      await newUser.save();
    } catch (error) {

    }
  }
  async validateUserMail({ email }) {
    try {

      const user = await this.usuarioRepository.getUserEmail(email);


      if (!user) {
        throw new Error('Credenciales inválidas');
      }


      const token = generateToken(user._id);

      return { user, token };
    } catch (error) {
      throw new Error('Error al buscar el usuario por correo electrónico o credenciales inválidas');
    }
  }
  async validateUser({ email, password }) {
    try {
      const user = await this.usuarioRepository.getUserEmail(email);


      if (!user) {
        throw new Error('Credenciales inválidas');
      }

      const validPassword = comparePassword(password, user.password);

      if (!validPassword) {
        throw new Error('Credenciales inválidas');
      }

      const token = generateToken(user._id);

      return { user, token };
    } catch (error) {
      throw new Error('Credenciales inválidas');
    }
  }
  async enviarCorreoRestablecimientoContraseña({ email, token }) {
    try {

      const user = await this.usuarioRepository.getUserEmail(email.email);


      if (!user) {
        console.log('Usuario no encontrado');
        return;
      }


      const resetToken = token.token;
      console.log('Usuari token ', resetToken);
      const resetExpires = Date.now() + 3600000;


      user.passwordResetToken = resetToken;
      user.passwordResetExpires = resetExpires;
      await user.save();

      const messageInfo = {
        email: user.email,
        name: user.name,
        lastname: user.lastname,
        resetToken,
      };
      await messageRepository.sendPasswordResetEmail(messageInfo);
    } catch (error) {

    }
  }


  async cambiarRolPremium(userId, esPremium) {
    try {
      const user = await this.usuarioRepository.getUserById(userId);

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      user.premium = esPremium;
      await user.save();
    } catch (error) {

      throw error;
    }
  }


  async restablecerContraseñaConToken(resetToken, newPassword) {
    try {

      const user = await this.usuarioRepository.getUserByResetToken(resetToken);
      console.log('que tiene user', user)

      if (!user) {

        return;
      }


      if (user.passwordResetExpires && user.passwordResetExpires < Date.now()) {

        return;
      }


      const hashedPassword = getHashedPassword(newPassword);
      user.password = hashedPassword;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();


    } catch (error) {
    }
  }

}

module.exports = UsuarioService;
