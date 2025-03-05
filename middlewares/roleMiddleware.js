const checkRol = (roles) => (req, res, next) => {
    try {
      const { user } = req;
      if (!user || !user.role) {
        return res.status(403).json({ message: 'No se encontraron roles para el usuario.' });
      }
  
      const rolesByUser = Array.isArray(user.role) ? user.role : [user.role]; // Soporta roles como array o string
      const hasPermission = roles.some((role) => rolesByUser.includes(role));
  
      if (!hasPermission) {
        return res.status(403).json({ message: 'El usuario no tiene permisos suficientes.' });
      }
  
      next();
    } catch (error) {
      res.status(500).json({ message: 'Error al verificar permisos', error: error.message });
    }
  };
  
  module.exports = checkRol;