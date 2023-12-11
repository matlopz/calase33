const { winstonlogger, productionLogger } = require('../utils/winston');

const logger = (req, res, next) => {
  // Puedes verificar el entorno aquí (por ejemplo, process.env.NODE_ENV)
  // y asignar el logger correspondiente
  const selectedLogger = process.env.NODE_ENV === 'prod' ? productionLogger : winstonlogger;

  req.logger = selectedLogger;
  res.logger = selectedLogger;

  next();
};

module.exports = logger;
