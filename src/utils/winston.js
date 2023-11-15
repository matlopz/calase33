const winston = require('winston');

const logLevels = {
  debug: 0,
  http: 1,
  info: 2,
  warning: 3,
  error: 4,
  fatal: 5,
};

const logColors = {
  debug: 'blue',
  http: 'green',
  info: 'cyan',
  warning: 'yellow',
  error: 'red',
  fatal: 'magenta',
};

const winstonlogger = winston.createLogger({
  levels: logLevels,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      const logMessage = `${timestamp} [${level}]: ${message}`;
      return stack ? `${logMessage}\n${stack}` : logMessage;
    })
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

const productionLogger = winston.createLogger({
  levels: logLevels,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'errors.log', level: 'error' }),
  ],
});

winston.addColors(logColors);

module.exports = { winstonlogger, productionLogger };
