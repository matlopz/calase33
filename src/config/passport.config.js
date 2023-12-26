const passport = require('passport')
const local = require('passport-local')
const GithubStrategy = require('passport-github2')
const jwt = require('passport-jwt')
const UsuarioService = require('../services/usuarioService')
const Usuarios = require('../models/Users.Model');
const { comparePassword } = require('../utils/bcrypts');
const cartsModels = require('../models/carts.Models');
const cookieExtractor = require('../utils/cookie.extractor');
const UserDto = require('../dto/user.dto')
const { authToken, generateToken } = require('../utils/jwt')
const LocalStrategy = local.Strategy
const JWTStrategy = jwt.Strategy
const ExtractJwt = jwt.ExtractJwt
const usuarioService = new UsuarioService()

const initializedPassport = () => {
  passport.use('register', new LocalStrategy(
    { passReqToCallback: true, usernameField: 'email' },
    async (req, username, password, done) => {
      const { name, lastname, email, age, number } = req.body;

      try {

        await usuarioService.validarEmail({ email: username });

        const userDto = new UserDto({
          name,
          lastname,
          email,
          age,
          password,
          number,
        });

        const newUser = await usuarioService.createUser(userDto);

        done(null, newUser);
      } catch (error) {
        done(`Error cuando creo el Usuario: ${error}`);
      }
    }
  ));


  passport.use('github', new GithubStrategy({
    clientID: 'Iv1.4d99ff6705843c98',
    clientSecret: '6fa5f6b1d62ec0bc20ef7e5d57e85ed4d658ffdf',
    callbackURL: 'http://localhost:8080/auth/githubcallback',
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      console.log(profile,'que tiene profile');
      const user = await Usuarios.findOne({ email: profile._json.email });
  
      if (!user) {
        // Si el usuario no existe, puedes crearlo aquí o manejarlo según tus necesidades
        return done(null, false, { message: 'Usuario no encontrado' });
      }
      console.log(user,'que tiene profile');
      // Utiliza la función generateToken para generar un token JWT
    
  
      // Pasa el token al cliente o al siguiente middleware según tus necesidades
      return done(null, { user });
    } catch (error) {
      return done(error); // Asegúrate de que 'done' se pase correctamente aquí
    }
  }));


  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secreto',
  };
  
  passport.use('jwt', new JWTStrategy(jwtOptions, async (jwt_payload, done) => {
    try {
      const user = await Usuarios.findById(jwt_payload.user._id);
      done(null, user || false);
    } catch (error) {
      done(error, false);
    }
  }));

  passport.deserializeUser(async (id, done) => {
    const user = await Usuarios.findById(id)
    done(null, user)
  })
}
module.exports = initializedPassport