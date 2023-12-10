const isAdmin = (user) => {
    // Implementa la lógica para verificar si el usuario es administrador
    // Puedes tener un campo en el modelo de usuario que indique el rol, por ejemplo: user.role === 'admin'
    // Aquí asumo que tienes un campo 'role' en tu modelo de usuario
    return user && user.role === 'admin';
  };
  
  const isPremium = (user) => {
    // Implementa la lógica para verificar si el usuario es premium
    // Puedes tener un campo en el modelo de usuario que indique el rol, por ejemplo: user.role === 'premium'
    // Aquí asumo que tienes un campo 'role' en tu modelo de usuario
    return user && user.role === 'premium';
  };
  
  module.exports = { isAdmin, isPremium };
  