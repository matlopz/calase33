

const UsuarioRepository = require('../repositories/UsuarioRepository');
//const cartsService = require('.cartsService');
const { comparePassword, getHashedPassword } = require('../utils/bcrypts');
const { generateToken, authToken } = require('../utils/jwt');
const {messageRepository,cartRepository} = require('../repositories/index'); // Asegúrate de ajustar la importación según tu estructura real de archivos.

//const cartService = new CartsService()
//this.cartService = new CartService()
class UsuarioService {
  
  constructor() {
    this.usuarioRepository = new UsuarioRepository();
   
    

  }

  async obtenerUsuario(id) {
    try {
      const user = await this.usuarioRepository.getUserById(id)
      if (!user) {
        console.error('Usuario no encontrado');
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
        console.log('El usuario ya existe');
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
      
      //const cart = await ({product: []});
      
      const cart = await cartRepository.createCart({ product: [] })
      console.log('que tiene cart cuando se crea?', cart)
      newUser.cart.push({ product: cart._id, quantity: 0 });

      const messageInfo = {
        name: newUser.name,
        number: newUser.number,
        email: newUser.email,
        lastname: newUser.lastname,
      };

      // Envío de SMS o correo electrónico
      await messageRepository.sendMessage(messageInfo)
      await newUser.save();
    } catch (error) {
      console.error('Error al crear el usuario:', error);
    }
  }
  async validateUserMail({ email}) {
    try {
      console.log('Tiene usuario', email);
      const user = await this.usuarioRepository.getUserEmail(email);
      console.log('Tiene usuario', user);

      if (!user) {
        throw new Error('Credenciales inválidas');
      }

    
      const token = generateToken(user._id);
      console.log('¿Qué tiene el token:', token);
      return { user, token };
    } catch (error) {
      throw new Error('Error al buscar el usuario por correo electrónico o credenciales inválidas');
    }
  }
  async validateUser({ email, password }) {
    try {
      const user = await this.usuarioRepository.getUserEmail(email);
      console.log('Tiene usuario', user);

      if (!user) {
        throw new Error('Credenciales inválidas');
      }

      const validPassword = comparePassword(password, user.password);

      if (!validPassword) {
        throw new Error('Credenciales inválidas');
      }

      const token = generateToken(user._id);
      console.log('¿Qué tiene el token:', token);
      return { user, token };
    } catch (error) {
      throw new Error('Error al buscar el usuario por correo electrónico o credenciales inválidas');
    }
  }
  async enviarCorreoRestablecimientoContraseña({email,token}) {
    try {
      console.log('que tiene email y token ',email,token)
      // Buscar usuario por correo electrónico
      const user = await this.usuarioRepository.getUserEmail(email.email);
      console.log('que tiene user en restablecer',user)

      if (!user) {
        console.log('Usuario no encontrado');
        return;
      }

      // pasarle e token único para la recuperación de contraseña
      const resetToken = token.token;
      console.log('Usuari token ',resetToken);
      const resetExpires = Date.now() + 3600000; // 1 hora de duración

      // Actualizar el usuario con el token y la expiración
      user.passwordResetToken = resetToken;
      user.passwordResetExpires = resetExpires;
      await user.save();

      // Enviar correo de recuperación de contraseña
      const messageInfo = {
        email: user.email,
        name: user.name,
        lastname: user.lastname,
        resetToken,
      };
      await messageRepository.sendPasswordResetEmail(messageInfo);
    } catch (error) {
      console.error('Error al enviar el correo de recuperación de contraseña:', error);
    }
  }
  // En el servicio de usuario

async cambiarRolPremium(userId, esPremium) {
  try {
    const user = await this.usuarioRepository.getUserById(userId);

    if (!user) {
      console.error('Usuario no encontrado');
      throw new Error('Usuario no encontrado');
    }

    user.premium = esPremium;
    await user.save();
  } catch (error) {
    console.error('Error al cambiar el rol a premium:', error);
    throw error;
  }
}


  async restablecerContraseñaConToken(resetToken, newPassword) {
    try {
      // Buscar usuario por token de restablecimiento
      const user = await this.usuarioRepository.getUserByResetToken(resetToken);
      console.log('que tiene user',user)

      if (!user) {
        console.log('Usuario no encontrado');
        return;
      }

      // Verificar que el token no haya expirado
      if (user.passwordResetExpires && user.passwordResetExpires < Date.now()) {
        console.log('El token ha expirado');
        return;
      }

      // Restablecer la contraseña y limpiar el token
      const hashedPassword = getHashedPassword(newPassword);
      user.password = hashedPassword;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      console.log('Contraseña restablecida con éxito');
    } catch (error) {
      console.error('Error al restablecer la contraseña con el token:', error);
    }
  }

}

module.exports = UsuarioService;
