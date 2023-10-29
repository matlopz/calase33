const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies['authCookie']; 
      console.log('Valor de la cookie:', token);
    }
    return token;
  };
  
module.exports = cookieExtractor
