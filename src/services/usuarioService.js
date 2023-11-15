

const UsuarioRepository = require('../repositories/UsuarioRepository');
//const cartsService = require('.cartsService');
const { comparePassword, getHashedPassword } = require('../utils/bcrypts');
const { generateToken } = require('../utils/jwt');
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
}

module.exports = UsuarioService;
