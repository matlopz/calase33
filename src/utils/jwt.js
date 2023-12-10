const jwt = require('jsonwebtoken');
const secretKey = 'secreto';

const generateToken = (user) => {
  return jwt.sign({ user }, secretKey);
};

const authToken = (req, res, next) => {
  // Determina si es una conexión de socket o una solicitud HTTP
  const isSocketConnection = req.hasOwnProperty('client');

  try {
    if (isSocketConnection) {
      // Lógica de autenticación para conexiones de socket
      const authToken = req.headers.authorization;
      
      if (!authToken) {
        throw new Error('Authentication error');
      }

      jwt.verify(authToken.split(' ')[1], secretKey, (error, credentials) => {
        if (error) {
          throw new Error('Forbidden');
        }

        req.user = credentials.user;
        next();
      });
    } else {
      // Lógica de autenticación para solicitudes HTTP
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({ status: 'error', error: 'Nooooo' });
      }

      const token = authHeader.split(' ')[1];

      jwt.verify(token, secretKey, (error, credentials) => {
        if (error) {
          return res.status(403).json({ status: 'error', error: 'Forbidden' });
        }

        req.user = credentials.user;
        next();
      });
    }
  } catch (error) {
    if (isSocketConnection) {
      next(new Error('Authentication error'));
    } else {
      res.status(403).json({ status: 'error', error: 'Forbidden' });
    }
  }
};

module.exports = {
  generateToken,
  authToken,
};
